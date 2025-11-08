# Frontend Integration Testing Guide

This guide covers the integration testing strategy for the MyFinance React application.

## Overview

Our integration tests verify that different components of the frontend work correctly together. The tests focus on:
- Component interactions within the React app
- State management between components  
- React Router integration
- Component lifecycle behavior
- Error handling across component boundaries

**Key Principle**: All tests run independently without external dependencies, ensuring fast and reliable execution in any environment.

## Test Structure

### Test Files
- `src/tests/integration/App.integration.test.tsx` - App and routing integration
- `src/tests/integration/AccountsPage.integration.test.tsx` - AccountsPage component integration

## Testing Strategy

### API Mocking Approach
All external API calls are mocked using Jest mocks, providing:
- Predictable test behavior
- Fast test execution  
- No external dependencies
- Ability to test various scenarios (success, error, edge cases)

```typescript
// Standard mocking pattern
jest.mock('../../utils/api', () => ({
  apiRequest: jest.fn(),
}));

const mockApiRequest = require('../../utils/api').apiRequest as jest.MockedFunction<any>;
```

### Component Integration Testing
Tests verify how React components work together:
- Parent-child component communication
- State flow between components
- Event handling and user interactions
- Conditional rendering based on state

```typescript
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);
```

## Running Integration Tests

### Local Development
```bash
# Run all integration tests
npm run test:integration

# Run specific integration test file
npm test -- --testPathPattern=integration

# Run with coverage
npm run test:integration:coverage
```

### CI/CD Pipeline Integration
Integration tests run strategically across pipeline stages:
- **Development**: Skipped for fast PR feedback (unit tests only)
- **Staging**: Full integration test suite for comprehensive validation
- **Production**: Complete test coverage for deployment confidence

## Test Categories

### 1. Component State Management Integration
Tests how components manage state transitions:
- Loading → Success
- Loading → Error
- State persistence during re-renders

### 2. Data Processing and Display Integration
Tests data flow within the application:
- Mock data processing
- Display formatting
- Currency handling
- Empty state rendering

### 3. Error Handling Integration
Tests error boundaries and graceful degradation:
- API error handling
- Malformed response handling
- Component error recovery

### 4. Component Lifecycle Integration
Tests React lifecycle interactions:
- Mount/unmount behavior
- Re-render handling
- Memory leak prevention

### 5. React Router Integration
Tests navigation and routing:
- Route parameter handling
- Navigation state persistence
- Router context integration

## Test Data

### Mock Account Data Structure
```typescript
const mockAccount = {
  id: 1,
  name: 'Test Account',
  identifier: 'test-001',
  currency: 1, // USD = 1, EUR = 2, etc.
  balance: 1000.00
};
```

### Common Mock Patterns
```typescript
// Success response
mockApiRequest.mockResolvedValue({
  ok: true,
  status: 200,
  json: () => Promise.resolve(mockData)
});

// Error response
mockApiRequest.mockRejectedValue(new Error('Network error'));

// Invalid response
mockApiRequest.mockResolvedValue({
  ok: false,
  status: 404,
  json: () => Promise.resolve({ message: 'Not found' })
});
```

## Best Practices

### 1. Mock All External Dependencies
- Mock API calls using Jest mocks
- Use predictable test data
- Test various response scenarios (success, error, timeout)

### 2. Focus on Component Integration
- Test how components work together
- Verify state flow between components  
- Test user interaction workflows
- Validate UI updates based on state changes

### 3. Test Error Handling
- Verify error boundaries work correctly
- Test graceful degradation scenarios
- Mock console.error to avoid test noise
- Ensure components handle unexpected data

### 4. Maintain Test Hygiene
- Reset mocks between tests using `beforeEach`
- Unmount components properly to prevent memory leaks
- Use meaningful test descriptions
- Keep tests focused and independent

## Example Integration Test

```typescript
test('manages loading state during data fetch', async () => {
  // Mock delayed response to test loading state
  mockApiRequest.mockImplementation(() => 
    new Promise((resolve) => 
      setTimeout(() => resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve([])
      }), 50)
    )
  );

  render(
    <TestWrapper>
      <AccountsPage />
    </TestWrapper>
  );

  // Should initially show loading state
  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  // Wait for loading to complete
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });

  // Should show empty state after loading
  expect(screen.getByText(/no accounts/i)).toBeInTheDocument();
});
```

## Debugging Integration Tests

### Common Issues
1. **Async Operations**: Use `waitFor()` for async state changes
2. **Mock Cleanup**: Ensure mocks are reset between tests
3. **Router Context**: Wrap components in TestWrapper for routing
4. **Console Errors**: Mock console.error for expected error scenarios

### Debugging Commands
```bash
# Run tests in watch mode
npm test -- --watch

# Run specific test with verbose output
npm test -- --testNamePattern="loading state" --verbose

# Debug with Node inspector
node --inspect-brk scripts/test.js --runInBand --no-cache
```

## Integration with CI/CD

Our integration tests provide:
- **Fast Execution**: Complete suite runs in under 3 seconds
- **Reliable Results**: No flaky tests due to external dependencies
- **Comprehensive Coverage**: Full frontend behavior validation
- **Easy Debugging**: Clear test failures with predictable mocks

This testing strategy ensures quality while maintaining fast development cycles and reliable deployment pipelines.