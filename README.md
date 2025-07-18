# Playwright MCP Testing with LM Studio

A comprehensive testing setup for https://humana.com using Playwright, Model Context Protocol (MCP), and LM Studio for AI-powered testing.

## Features

- 🎭 **Playwright Testing Framework**: Modern, fast, and reliable end-to-end testing
- 🤖 **AI-Powered Testing**: Integration with LM Studio for intelligent test generation
- 📊 **MCP Integration**: Model Context Protocol for advanced AI capabilities
- 📱 **Responsive Design Testing**: Multi-viewport testing across devices
- ♿ **Accessibility Testing**: Basic accessibility checks and analysis
- 📊 **Performance Monitoring**: Load time and performance metrics
- 📸 **Visual Testing**: Screenshot capture and comparison
- 🔍 **Comprehensive Coverage**: Page structure, navigation, and functionality testing

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- LM Studio (running locally on port 1234)
- A compatible language model in LM Studio

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Playwright browsers:**
   ```bash
   npm run install-browsers
   ```

3. **Configure LM Studio:**
   - Start LM Studio
   - Load a compatible model (e.g., Llama 3.2 3B Instruct)
   - Ensure the API server is running on `http://localhost:1234`

4. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your specific configuration:
   ```env
   LM_STUDIO_URL=http://localhost:1234
   LM_STUDIO_MODEL=llama-3.2-3b-instruct
   LM_STUDIO_API_KEY=lm-studio
   BASE_URL=https://humana.com
   ```

## Project Structure

```
playwright-mcp-testing/
├── tests/
│   ├── pages/
│   │   └── HomePage.ts              # Page Object Model
│   ├── humana.test.ts               # Basic tests
│   ├── humana-comprehensive.spec.ts # Comprehensive testing
│   └── ai-powered-test.spec.ts      # AI-powered testing
├── mcp/
│   ├── mcpUtils.ts                  # MCP connection utilities
│   └── lmStudioClient.ts            # LM Studio API client
├── utils/
│   └── testHelpers.ts               # Test utility functions
├── screenshots/                     # Test screenshots
├── playwright.config.ts             # Playwright configuration
├── tsconfig.json                    # TypeScript configuration
└── .env                            # Environment variables
```

## Running Tests

### Basic Test Commands

```bash
# Run all tests
npm test

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests with UI (interactive mode)
npm run test:ui

# Run tests in debug mode
npm run test:debug

# Show test report
npm run test:report
```

### Specific Test Suites

```bash
# Run basic tests
npx playwright test humana.test.ts

# Run comprehensive tests
npx playwright test humana-comprehensive.spec.ts

# Run AI-powered tests (requires LM Studio)
npx playwright test ai-powered-test.spec.ts
```

### Browser-Specific Testing

```bash
# Run tests on specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Types

### 1. Basic Tests (`humana.test.ts`)
- Homepage loading with Humana title verification
- Navigation presence for healthcare navigation
- Humana-specific navigation elements (Shop/Plans, Members, Providers)

### 2. Comprehensive Tests (`humana-comprehensive.spec.ts`)
- **Homepage validation**: Title, URL, content verification
- **Navigation testing**: Menu visibility and functionality
- **Responsive design**: Multi-viewport testing
- **Performance monitoring**: Load time and metrics
- **Accessibility checks**: Basic WCAG compliance
- **Error detection**: Console errors and warnings
- **Resource validation**: External links and assets

### 3. AI-Powered Tests (`ai-powered-test.spec.ts`)
- **AI page analysis**: Intelligent page structure analysis
- **Dynamic test generation**: AI-generated test steps
- **Accessibility AI review**: AI-powered accessibility analysis
- **Responsive AI testing**: AI-driven responsive design evaluation

## LM Studio Integration

### Setup LM Studio

1. **Download and install LM Studio**
2. **Download a compatible model**:
   - Llama 3.2 3B Instruct (recommended)
   - Llama 3.1 8B Instruct
   - Other instruction-tuned models

3. **Start the API server**:
   - Open LM Studio
   - Go to "Local Server" tab
   - Load your model
   - Start the server on port 1234

### AI Features

- **Page Analysis**: AI analyzes page structure and suggests improvements
- **Test Generation**: AI generates context-aware test steps
- **Accessibility Review**: AI identifies potential accessibility issues
- **Responsive Analysis**: AI evaluates responsive design across viewports

## MCP Integration

The Model Context Protocol integration allows for more advanced AI capabilities:

```typescript
// Example MCP usage
import { connectToMCP, sendMCPMessage } from './mcp/mcpUtils';

const mcpConnection = await connectToMCP();
const response = await sendMCPMessage(mcpConnection, {
  method: 'analyze_page',
  params: { content: pageContent }
});
```

## Configuration

### Playwright Configuration

Key configuration options in `playwright.config.ts`:

- **Base URL**: Set to `https://humana.com`
- **Timeouts**: Navigation and action timeouts
- **Browsers**: Chrome, Firefox, Safari, Mobile variants
- **Screenshots**: On failure
- **Videos**: On failure retry
- **Traces**: On first retry

### Environment Variables

```env
# LM Studio Configuration
LM_STUDIO_URL=http://localhost:1234
LM_STUDIO_MODEL=llama-3.2-3b-instruct
LM_STUDIO_API_KEY=lm-studio

# MCP Configuration
MCP_SERVER_URL=ws://localhost:8080
MCP_TIMEOUT=30000

# Test Configuration
TEST_TIMEOUT=60000
HEADLESS=true
BASE_URL=https://humana.com
```

## Test Results

### Reports and Artifacts

- **HTML Report**: `playwright-report/index.html`
- **JSON Results**: `test-results.json`
- **JUnit XML**: `test-results.xml`
- **Screenshots**: `screenshots/` directory
- **Videos**: `test-results/` directory
- **Traces**: `test-results/` directory

### CI/CD Integration

The tests are configured for CI/CD with:
- Parallel execution control
- Retry mechanisms
- Artifact collection
- Multiple browser testing

## Troubleshooting

### Common Issues

1. **LM Studio Connection Failed**
   - Ensure LM Studio is running
   - Check the API server is started
   - Verify the URL in `.env` file

2. **Page Load Timeouts**
   - Increase timeout values in `playwright.config.ts`
   - Check network connectivity
   - Verify https://humana.com is accessible

3. **Browser Installation Issues**
   - Run `npm run install-browsers`
   - Check disk space
   - Verify system compatibility

### Debug Mode

For debugging test issues:

```bash
# Run in debug mode
npm run test:debug

# Run with verbose output
npx playwright test --verbose

# Run single test file
npx playwright test tests/humana.test.ts --debug
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## License

This project is licensed under the ISC License. See the LICENSE file for details.

## Support

For issues and questions:
- Check the troubleshooting section
- Review Playwright documentation
- Check LM Studio documentation
- Open an issue in the repository
