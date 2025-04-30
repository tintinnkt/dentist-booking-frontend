import { test, expect } from '@playwright/test';

test('test comment creation and deletion', async ({ page }) => {
  // Set a longer timeout
  test.setTimeout(90000);
  
  console.log('Starting test...');
  
  try {
    // Navigate to the list page
    console.log('Navigating to homepage...');
    await page.goto('http://localhost:3000/list');
    console.log('Navigation complete');
    
    // Login as user1
    console.log('Starting first login flow...');
    await page.getByRole('button').first().click();
    await page.getByRole('menuitem', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('user1@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('12345678');
    await page.getByRole('button', { name: 'Log in Log in' }).click();
    console.log('First login complete');
    
    // Take a screenshot after login
    await page.screenshot({ path: 'after-first-login.png' });
    
    // View comments
    console.log('Viewing comments...');
    await page.getByRole('button', { name: 'View Comments (4)' }).click();
    await expect(page.locator('div:nth-child(4)').first()).toBeVisible();
    console.log('Comments are visible');
    
    // Add comment
    const ourCommentText = 'good';
    console.log('Adding comment...');
    await page.getByRole('button', { name: 'Add Comment' }).click();
    await page.getByRole('textbox', { name: 'Write your comment...' }).fill(ourCommentText);
    await page.getByRole('button', { name: 'Send' }).click();
    console.log('Comment added');
    
    // Verify comment was added
    await expect(page.getByText('user1')).toBeVisible();
    console.log('User comment verified');
    
    // Take a screenshot after adding comment
    await page.screenshot({ path: 'after-adding-comment.png' });
    
    // Logout
    console.log('Logging out first user...');
    await page.getByRole('button').filter({ hasText: /^$/ }).first().click();
    await page.getByRole('menuitem', { name: 'user1' }).click();
    await page.getByRole('button', { name: 'logout' }).click();
    console.log('First logout complete');
    
    // Login as admin
    console.log('Starting admin login...');
    await page.getByRole('button').first().click();
    await page.getByRole('menuitem', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('admin@gmail.com');
    await page.getByRole('textbox', { name: 'Password' }).fill('12345678');
    await page.getByRole('button', { name: 'Log in Log in' }).click();
    console.log('Admin login complete');
    
    // Take a screenshot after admin login
    await page.screenshot({ path: 'after-admin-login.png' });
    
    // View comments again as admin
    console.log('Viewing comments as admin...');
    await page.getByRole('button', { name: 'View Comments (5)' }).click();
    await expect(page.locator('div:nth-child(4)').first()).toBeVisible();
    console.log('Comments visible to admin');
    
    // Find the specific comment using the exact structure from your HTML
    console.log('Locating our comment...');
    const commentBox = page.locator('div.pt-2.font-medium.text-gray-800', { hasText: 'good' })
        .locator('..') // Move to parent container
        .filter({ has: page.getByText('user1') });
    
     await expect(commentBox).toBeVisible();
    console.log('Found our comment box');
    
    // Locate and click the delete button using your exact HTML structure
    const deleteButton = commentBox.locator('div.absolute.right-2.bottom-2 > button.text-red-500');
    await expect(deleteButton).toBeVisible();
    await deleteButton.click();
    console.log('Clicked delete button');
    
    // Verify deletion
    await expect(commentBox).not.toBeVisible({ timeout: 5000 });
    console.log('Comment successfully deleted');

    await page.screenshot({ path: 'after-deleting-comment.png' });
    
    console.log('Test completed successfully');
  } catch (error) {
    console.error('Test failed with error:', error);
    await page.screenshot({ path: 'error-state.png' });
    throw error;
  }
});