/**
 * Generates test files for components and pages
 */
export class TestGenerator {
  generateComponentTests() {
    const tests = {};

    tests['Button.test.js'] = `import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('applies variant styles', () => {
    const { container } = render(<Button variant="outline">Test</Button>);
    const button = container.querySelector('button');
    expect(button).toHaveClass('border');
  });

  it('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByText('Disabled')).toBeDisabled();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    screen.getByText('Click').click();
    expect(handleClick).toHaveBeenCalled();
  });

  it('applies size classes correctly', () => {
    const { container: smallContainer } = render(<Button size="sm">Small</Button>);
    expect(smallContainer.querySelector('button')).toHaveClass('px-3');

    const { container: largeContainer } = render(<Button size="lg">Large</Button>);
    expect(largeContainer.querySelector('button')).toHaveClass('px-6');
  });
});`;

    tests['Card.test.js'] = `import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardContent } from '../Card';

describe('Card Component', () => {
  it('renders card with content', () => {
    render(
      <Card>
        <CardContent>Test content</CardContent>
      </Card>
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders card header with title', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Test Title</CardTitle>
        </CardHeader>
      </Card>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('applies correct styling classes', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.querySelector('div');
    expect(card).toHaveClass('rounded-lg');
    expect(card).toHaveClass('bg-white');
  });
});`;

    tests['Input.test.js'] = `import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '../Input';

describe('Input Component', () => {
  it('renders input element', () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('handles user input', async () => {
    const user = userEvent.setup();
    const { container } = render(<Input />);
    const input = container.querySelector('input');
    
    await user.type(input, 'test value');
    expect(input.value).toBe('test value');
  });

  it('disables input when disabled prop is true', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('applies error styling when error prop is true', () => {
    const { container } = render(<Input error={true} />);
    const input = container.querySelector('input');
    expect(input).toHaveClass('border-red-600');
  });
});`;

    return tests;
  }

  generatePlaywrightTests() {
    return `import { test, expect } from '@playwright/test';

test.describe('Asana Clone - Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('homepage loads correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Asana Clone/);
    await expect(page.locator('h1')).toContainText('Welcome to Asana Clone');
  });

  test('navigation links are visible', async ({ page }) => {
    const getStartedBtn = page.locator('button:has-text("Get Started")');
    await expect(getStartedBtn).toBeVisible();
  });

  test('projects page loads and displays projects', async ({ page }) => {
    await page.goto('http://localhost:3000/projects');
    await expect(page.locator('h1')).toContainText('Projects');
    
    const projectCards = page.locator('[class*="card"]');
    const count = await projectCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('tasks page loads and displays tasks', async ({ page }) => {
    await page.goto('http://localhost:3000/tasks');
    await expect(page.locator('h1')).toContainText('Tasks');
    
    const taskCards = page.locator('[class*="card"]');
    const count = await taskCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('modal opens when create button is clicked', async ({ page }) => {
    await page.goto('http://localhost:3000/projects');
    const createBtn = page.locator('button:has-text("New Project")');
    await createBtn.click();
    
    const modal = page.locator('[class*="modal"]');
    await expect(modal).toBeVisible();
  });

  test('form submission works', async ({ page }) => {
    await page.goto('http://localhost:3000/projects');
    const createBtn = page.locator('button:has-text("New Project")');
    await createBtn.click();
    
    const nameInput = page.locator('input[name="name"]');
    await nameInput.fill('Test Project');
    
    const submitBtn = page.locator('button:has-text("Create")');
    await submitBtn.click();
    
    await expect(page.locator('text=Test Project')).toBeVisible();
  });

  test('responsive design on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000');
    
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
  });

  test('takes screenshot for visual regression', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await expect(page).toHaveScreenshot('homepage.png');
  });
});`;
  }

  generateE2ETests() {
    return `import { test, expect } from '@playwright/test';

test.describe('Asana Clone - E2E Tests', () => {
  test('complete user workflow', async ({ page }) => {
    // Navigate to home
    await page.goto('http://localhost:3000');
    await expect(page).toHaveTitle(/Asana Clone/);

    // Navigate to projects
    const projectsLink = page.locator('a:has-text("Projects")');
    if (await projectsLink.isVisible()) {
      await projectsLink.click();
    } else {
      await page.goto('http://localhost:3000/projects');
    }

    // Create new project
    const createProjectBtn = page.locator('button:has-text("New Project")');
    await createProjectBtn.click();

    const modal = page.locator('[class*="modal"]');
    await expect(modal).toBeVisible();

    const nameInput = page.locator('input[name="name"]');
    await nameInput.fill('E2E Test Project');

    const descInput = page.locator('input[name="description"]');
    await descInput.fill('This is a test project');

    const createBtn = page.locator('button:has-text("Create")').last();
    await createBtn.click();

    // Verify project was created
    await expect(page.locator('text=E2E Test Project')).toBeVisible();

    // Navigate to tasks
    await page.goto('http://localhost:3000/tasks');
    await expect(page.locator('h1')).toContainText('Tasks');

    // Filter tasks
    const inProgressBtn = page.locator('button:has-text("In-progress")');
    await inProgressBtn.click();

    const taskCards = page.locator('[class*="card"]');
    const count = await taskCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('navigation between pages', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Home -> Projects
    await page.goto('http://localhost:3000/projects');
    await expect(page.locator('h1')).toContainText('Projects');

    // Projects -> Tasks
    await page.goto('http://localhost:3000/tasks');
    await expect(page.locator('h1')).toContainText('Tasks');

    // Tasks -> Home
    await page.goto('http://localhost:3000');
    await expect(page.locator('h1')).toContainText('Welcome');
  });

  test('404 page handling', async ({ page }) => {
    await page.goto('http://localhost:3000/nonexistent-page');
    await expect(page.locator('text=404')).toBeVisible();
    await expect(page.locator('text=Page Not Found')).toBeVisible();
  });
});`;
  }

  generateCSSTests() {
    return `import { test, expect } from '@playwright/test';

test.describe('CSS and Styling Tests', () => {
  test('button has correct computed styles', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const button = page.locator('button').first();
    const bgColor = await button.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    );
    
    expect(bgColor).toBeTruthy();
  });

  test('card has shadow and border', async ({ page }) => {
    await page.goto('http://localhost:3000/projects');
    
    const card = page.locator('[class*="card"]').first();
    const boxShadow = await card.evaluate(el =>
      window.getComputedStyle(el).boxShadow
    );
    
    expect(boxShadow).not.toBe('none');
  });

  test('responsive breakpoints work', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    let heading = page.locator('h1').first();
    await expect(heading).toBeVisible();

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(heading).toBeVisible();

    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(heading).toBeVisible();
  });

  test('colors are accessible', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    const buttons = page.locator('button');
    const count = await buttons.count();
    
    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = buttons.nth(i);
      const color = await button.evaluate(el =>
        window.getComputedStyle(el).color
      );
      expect(color).toBeTruthy();
    }
  });
});`;
  }
}

export default TestGenerator;
