
const express = require('express');
const router = express.Router();

// Get help data
router.get('/', async (req, res) => {
  try {
    const helpData = {
      faqs: [
        {
          question: 'What is LostCloud?',
          answer: 'LostCloud is a platform for managing and monitoring Minecraft bots. It allows you to create, configure, and monitor bots that can perform various tasks in Minecraft servers.'
        },
        {
          question: 'How do I create a bot?',
          answer: 'To create a bot, navigate to the Bot Manager page and click on the "Create New Bot" button. Fill in the required information and settings for your bot, then click "Create".'
        },
        {
          question: 'Is LostCloud free to use?',
          answer: 'LostCloud offers both free and premium plans. The free plan includes basic features, while premium plans offer additional capabilities and higher limits.'
        },
        {
          question: 'How can I report inappropriate content?',
          answer: 'If you encounter inappropriate content, use the report button available on posts, comments, or user profiles. Our moderation team will review reports promptly.'
        },
        {
          question: 'Can I use LostCloud on mobile devices?',
          answer: 'Yes, LostCloud is fully responsive and works on desktops, tablets, and mobile phones.'
        }
      ],
      botCommands: [
        {
          command: '/start',
          description: 'Starts the bot'
        },
        {
          command: '/stop',
          description: 'Stops the bot'
        },
        {
          command: '/status',
          description: 'Shows the current status of the bot'
        },
        {
          command: '/settings',
          description: 'Displays or changes bot settings'
        },
        {
          command: '/help',
          description: 'Shows available commands and their descriptions'
        }
      ],
      contact: {
        email: 'support@lostcloud.io',
        discord: 'https://discord.gg/lostcloud'
      }
    };

    res.json(helpData);
  } catch (err) {
    console.error('Error fetching help data:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
