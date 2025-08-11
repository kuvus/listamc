# Server Status Update Script

This directory contains scripts for managing server status updates in the ListaMC project.

## Usage

### Running the Update Script

The server status update script can be run using the npm script:

```bash
pnpm run update-servers
```

Or directly using ts-node:

```bash
npx ts-node --compiler-options '{"module":"CommonJS"}' src/scripts/update-statuses.ts
```

### What the Script Does

The `update-statuses.ts` script:

1. **Fetches all servers** from the database in batches of 100
2. **Respects rate limits** with sophisticated handling:
    - Honors `RateLimit-Retry-After` headers
    - Handles `429 Too Many Requests` responses
    - Proactively throttles when approaching rate limits
3. **Updates server status** using the GameData API
4. **Skips recently updated servers** (configurable, default: 5 minutes)
5. **Handles errors gracefully** by marking servers as offline
6. **Provides detailed logging** with emojis for easy monitoring

### Configuration

You can modify the configuration constants at the top of the script:

```typescript
const CONFIG = {
    BATCH_SIZE: 100, // Servers per batch
    MIN_UPDATE_INTERVAL_MINUTES: 5, // Minimum time between updates
    RATE_LIMIT_TOKENS_PER_SECOND: 50, // API rate limit (PRO plan)
    PROACTIVE_COOLDOWN_THRESHOLD: 1, // Cooldown when <= 1 request remaining
}
```

### Environment Requirements

Make sure you have the following environment variable set:

- `GAMEDATA_API_KEY` - Your GameData API key

### Scheduling

For production use, you can schedule this script to run periodically using:

- **Cron job** (Linux/macOS):

    ```bash
    # Run every 10 minutes
    */10 * * * * cd /path/to/listamc && pnpm run update-servers
    ```

- **systemd timer** (Linux)
- **Task Scheduler** (Windows)
- **PM2** with cron restart
- **Docker with cron**

### Monitoring

The script outputs detailed logs with:

- 🚀 Start/completion messages
- 📦 Batch processing info
- 🔄 Individual server updates
- ✅ Successful updates with timing
- ⚠️ Server errors
- ⏸️ Rate limiting actions
- ❌ Fatal errors

### Error Handling

The script handles various scenarios:

- **Server unreachable**: Marked as offline
- **Invalid server address**: Marked as offline
- **API rate limits**: Automatic retry with backoff
- **Network timeouts**: Graceful error handling
- **Database errors**: Logged and continued
