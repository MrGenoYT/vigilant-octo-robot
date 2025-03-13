const Bot = require('./models/Bot');
const { EventEmitter } = require('events');
const mineflayer = require('mineflayer');
const pathfinder = require('mineflayer-pathfinder');
const { GoalNear, GoalBlock, GoalXZ, GoalY, GoalFollow } = pathfinder.goals;

class BotManager {
  constructor() {
    this.bots = new Map();
    this.io = null;
    this.events = new EventEmitter();
  }

  init(io) {
    this.io = io;
    
    // Setup event listeners
    this.events.on('bot-connect', (botId) => {
      this.notifyStatusChange(botId, true);
    });
    
    this.events.on('bot-disconnect', (botId) => {
      this.notifyStatusChange(botId, false);
    });
    
    this.events.on('bot-message', (botId, message) => {
      this.sendLog(botId, 'info', message);
    });
    
    this.events.on('bot-error', (botId, error) => {
      this.sendLog(botId, 'error', error);
    });

    // Check for any bots that should be running
    this.loadActiveBots();

    console.log('Bot Manager initialized');
  }

  async loadActiveBots() {
    try {
      const activeBots = await Bot.find({ 'configuration.autoReconnect': true });
      console.log(`Loading ${activeBots.length} active bots...`);
      
      activeBots.forEach(bot => {
        this.startBot(bot._id.toString());
      });
    } catch (error) {
      console.error('Error loading active bots:', error);
    }
  }

  async startBot(botId) {
    try {
      // If bot is already running, do nothing
      if (this.bots.has(botId)) {
        return { success: true, message: 'Bot is already running' };
      }

      // Find bot in database
      const bot = await Bot.findById(botId);
      if (!bot) {
        return { success: false, message: 'Bot not found' };
      }

      this.sendLog(botId, 'info', `Connecting to ${bot.serverIP}:${bot.serverPort}...`);

      // Create Mineflayer bot instance
      const botInstance = mineflayer.createBot({
        host: bot.serverIP,
        port: bot.serverPort || 25565,
        username: bot.username,
        version: bot.version,
        auth: 'microsoft'  // You may need to adjust this based on your authentication method
      });

      // Setup Mineflayer pathfinder plugin
      botInstance.loadPlugin(pathfinder.pathfinder);
      
      // Initialize pathfinding
      botInstance.once('spawn', () => {
        const mcData = require('minecraft-data')(botInstance.version);
        botInstance.pathfinder.setMovements(new pathfinder.Movements(botInstance, mcData));
        
        // Set initial status to connected
        botInstance.status = 'connected';
        botInstance.lastActivity = Date.now();
        this.events.emit('bot-connect', botId);
        this.sendLog(botId, 'success', 'Connected successfully');
        
        // Update bot status in DB
        Bot.findByIdAndUpdate(botId, { status: 'online', lastConnected: Date.now() }).catch(err => {
          console.error(`Error updating bot status: ${err.message}`);
        });
        
        // Start anti-AFK if enabled
        if (bot.configuration.preventAfk) {
          this.startAntiAfk(botId, botInstance);
        }
      });
      
      // Set up bot events
      botInstance.on('message', (message) => {
        this.sendLog(botId, 'info', message.toString());
      });
      
      botInstance.on('error', (err) => {
        this.events.emit('bot-error', botId, err.message);
        
        // If the bot is disconnected due to an error, try to reconnect
        if (bot.configuration.autoReconnect) {
          this.reconnectBot(botId);
        }
      });
      
      botInstance.on('end', () => {
        this.sendLog(botId, 'info', 'Disconnected from server');
        botInstance.status = 'disconnected';
        this.events.emit('bot-disconnect', botId);
        
        // Update bot status in DB
        Bot.findByIdAndUpdate(botId, { status: 'offline', lastDisconnected: Date.now() }).catch(err => {
          console.error(`Error updating bot status: ${err.message}`);
        });
        
        // Try to reconnect if auto-reconnect is enabled
        if (bot.configuration.autoReconnect) {
          this.sendLog(botId, 'info', `Will attempt to reconnect in ${bot.configuration.reconnectDelay/1000} seconds...`);
          setTimeout(() => {
            this.reconnectBot(botId);
          }, bot.configuration.reconnectDelay);
        } else {
          // Remove bot from active bots
          this.bots.delete(botId);
        }
      });
      
      // Add custom properties and methods to botInstance
      botInstance.id = botId;
      botInstance.name = bot.name;
      botInstance.status = 'connecting';
      botInstance.lastActivity = Date.now();
      
      // Store bot instance
      this.bots.set(botId, botInstance);
      
      return { success: true, message: 'Bot started successfully' };
    } catch (error) {
      console.error(`Error starting bot ${botId}:`, error);
      return { success: false, message: `Error starting bot: ${error.message}` };
    }
  }

  async stopBot(botId) {
    try {
      const botInstance = this.bots.get(botId);
      if (!botInstance) {
        return { success: false, message: 'Bot is not running' };
      }
      
      this.sendLog(botId, 'info', 'Stopping bot...');
      
      // Disconnect bot
      botInstance.quit();
      
      // Remove bot instance
      this.bots.delete(botId);
      
      // Update bot status in DB
      await Bot.findByIdAndUpdate(botId, { status: 'offline', lastDisconnected: Date.now() });
      
      return { success: true, message: 'Bot stopped successfully' };
    } catch (error) {
      console.error(`Error stopping bot ${botId}:`, error);
      return { success: false, message: `Error stopping bot: ${error.message}` };
    }
  }
  
  async reconnectBot(botId) {
    // Just restart the bot
    await this.startBot(botId);
  }

  notifyStatusChange(botId, isOnline) {
    if (this.io) {
      this.io.to(`bot:${botId}`).emit('bot-status', { online: isOnline });
    }
  }

  sendLog(botId, type, message) {
    if (this.io) {
      this.io.to(`bot:${botId}`).emit('bot-log', { type, message });
    }
  }

  startAntiAfk(botId, botInstance) {
    const actions = [
      () => botInstance.setControlState('jump', true),
      () => botInstance.setControlState('jump', false),
      () => botInstance.swingArm(),
      () => {
        // Look around randomly
        botInstance.look(
          Math.random() * Math.PI * 2, 
          Math.random() * Math.PI - (Math.PI / 2), 
          false
        );
      }
    ];
    
    // Execute a random action every 30 seconds
    const interval = setInterval(() => {
      if (!this.bots.has(botId) || botInstance.status !== 'connected') {
        clearInterval(interval);
        return;
      }
      
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      randomAction();
      this.sendLog(botId, 'info', 'Performing anti-AFK action');
      botInstance.lastActivity = Date.now();
    }, 30000); // Every 30 seconds

    // Store the interval reference on the bot instance for cleanup
    botInstance.antiAfkInterval = interval;
  }

  sendCommand(botId, command, params, callback) {
    try {
      const botInstance = this.bots.get(botId);
      if (!botInstance) {
        return callback({ success: false, message: 'Bot is not running' });
      }
      
      if (botInstance.status !== 'connected') {
        return callback({ success: false, message: 'Bot is not connected' });
      }
      
      this.sendLog(botId, 'info', `Executing command: ${command}`);
      
      // Handle different commands using Mineflayer
      switch (command.toLowerCase()) {
        case 'say':
          if (!params || !params.message) {
            return callback({ success: false, message: 'Message parameter is required' });
          }
          botInstance.chat(params.message);
          return callback({ success: true, message: `Said: ${params.message}` });
          
        case 'move':
          if (!params || !params.x === undefined || params.y === undefined || params.z === undefined) {
            return callback({ success: false, message: 'x, y, z coordinates are required' });
          }
          
          const goal = new GoalNear(params.x, params.y, params.z, 1);
          botInstance.pathfinder.setGoal(goal);
          return callback({ success: true, message: `Moving to ${params.x}, ${params.y}, ${params.z}` });
          
        case 'jump':
          botInstance.setControlState('jump', true);
          setTimeout(() => {
            botInstance.setControlState('jump', false);
          }, 500);
          return callback({ success: true, message: 'Jumped!' });
          
        case 'followPlayer':
          if (!params || !params.username) {
            return callback({ success: false, message: 'Player username parameter is required' });
          }
          
          const target = botInstance.players[params.username];
          if (!target) {
            return callback({ success: false, message: `Player ${params.username} not found` });
          }
          
          botInstance.pathfinder.setGoal(new GoalFollow(target.entity, 2), true);
          return callback({ success: true, message: `Following player: ${params.username}` });
          
        case 'status':
          return callback({ 
            success: true, 
            message: `Status: ${botInstance.status}, Position: ${JSON.stringify(botInstance.entity?.position)}, Health: ${botInstance.health}, Food: ${botInstance.food}, Last activity: ${new Date(botInstance.lastActivity).toLocaleTimeString()}` 
          });
          
        default:
          return callback({ success: false, message: `Unknown command: ${command}` });
      }
    } catch (error) {
      console.error(`Error executing command for bot ${botId}:`, error);
      return callback({ success: false, message: `Error executing command: ${error.message}` });
    }
  }

  getBotStatus(botId) {
    const botInstance = this.bots.get(botId);
    if (!botInstance) {
      return { running: false, connected: false };
    }
    
    return {
      running: true,
      connected: botInstance.status === 'connected',
      status: botInstance.status,
      position: botInstance.entity ? botInstance.entity.position : null,
      health: botInstance.health,
      food: botInstance.food,
      lastActivity: botInstance.lastActivity
    };
  }
}

// Export singleton instance
module.exports = new BotManager();
