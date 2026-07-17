import { expect, test } from '@playwright/test'

test('user can register from the register page', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear()
  })

  await page.route('**/api/v1/users/register', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({}),
    })
  })

  await page.route('**/api/v1/auth/token', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        access_token: 'test-access-token',
        token_type: 'bearer',
      }),
    })
  })

  await page.route('**/api/v1/users/me/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        username: 'alice',
        email: 'alice@example.com',
        disabled: false,
        id: 1,
        hashed_password: 'hashed-password',
      }),
    })
  })

  await page.route('**/api/v1/heroes*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    })
  })

  await page.goto('/register')

  await page.getByLabel('Username *').fill('alice')
  await page.getByLabel('Email *').fill('alice@example.com')
  await page.getByLabel('Password *').fill('secret123')
  await page.getByRole('button', { name: 'Create account' }).click()

  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByText('Welcome back, alice')).toBeVisible()
})
