# The Blue Alliance API Configuration

QRScout can integrate with The Blue Alliance API to automatically fetch match data and team information. This guide will walk you through setting up your API key.

## Prerequisites

- A team account on The Blue Alliance
- Administrative access to your team's account

## Getting Your API Key

### Step 1: Create a Blue Alliance Account

1. Go to [The Blue Alliance website](https://www.thebluealliance.com/account/login?next=http://www.thebluealliance.com/account)
2. If you don't have an account, click **Sign Up** and create one
3. If your team already has an account, ask your team lead for access

### Step 2: Generate an API Key

1. Log into your Blue Alliance account
2. Navigate to your **More** menu (top right corner) > **Account**
3. Go to the **API Keys** section
4. Click **Add New Key**
5. Give your key a descriptive name (e.g., "QRScout Integration")
6. Copy the generated API key - **save this somewhere safe!**

### Step 3: Configure QRScout

1. Open QRScout in your browser
2. Click the **"Prefill match data"** button
3. If this is your first time, you'll be prompted to enter your API key
4. Paste your API key and click **Test & Save**
5. If successful, you can now use match data prefilling!

## API Key Storage

- Your API key is stored locally in your browser's localStorage
- It is **NOT** included in your QRScout configuration exports
- Each team member will need to configure their own API key
- The key persists until you clear your browser data or manually remove it

## Troubleshooting

### "Invalid API Key" Error
- Double-check that you copied the entire API key
- Ensure there are no extra spaces before or after the key
- Verify that the API key hasn't been revoked in your Blue Alliance account

### "Access Denied" Error
- Make sure your Blue Alliance account has the necessary permissions
- Check that you're using a current API key (not an expired one)

### "Too Many Requests" Error
- The Blue Alliance API has rate limits
- Wait a few minutes before trying again
- Avoid making rapid consecutive requests

## API Key Management

### Updating Your API Key
1. Click **"Prefill match data"**
2. Click **"Update API Key"** in the dialog
3. Enter your new API key and test it

### Removing Your API Key
1. Open your browser's Developer Tools (F12)
2. Go to the **Application** or **Storage** tab
3. Find **Local Storage** for your QRScout domain
4. Delete the `tba-api-key` entry

## Security Notes

- **Never share your API key** with people outside your team
- **Never commit API keys** to version control or public repositories
- If you suspect your key has been compromised, revoke it in your Blue Alliance account and generate a new one
- API keys should be treated like passwords

## Supported Features

With a configured API key, QRScout can:

- Fetch your team's competition events for the current season
- Load match schedules for selected events
- Automatically populate team numbers and robot positions
- Display match-specific information in dropdown selectors

## Need Help?

If you're having trouble with API key configuration:

1. Check the troubleshooting section above
2. Verify your steps against this guide
3. Ask your team's technical lead for assistance
4. Contact The Blue Alliance support if you're having account issues
5. Open an issue on the [QRScout GitHub repository](https://github.com/FRC2713/QRScout) for help with QRScout-specific problems
