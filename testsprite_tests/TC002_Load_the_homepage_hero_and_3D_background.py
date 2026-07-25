import asyncio
import re
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        pw = await async_api.async_playwright().start()
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",
                "--disable-dev-shm-usage",
                "--ipc=host",
                "--single-process"
            ],
        )
        context = await browser.new_context()
        context.set_default_timeout(15000)
        page = await context.new_page()
        # -> navigate
        await page.goto("http://localhost:3000")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Click the 'THE GENESIS' chapter button to attempt to advance past the initializing screen and load the hero chapter and 3D background.
        # button "THE GENESIS"
        elem = page.locator("xpath=/html/body/div/div/nav/div[2]/button").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # -> Try a different chapter button to trigger loading: click the 'I — THE GENESIS' chapter button (index 108) and observe whether the hero chapter and 3D background load.
        # button
        elem = page.locator("xpath=/html/body/div/div/div[3]/div/button").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.click()
        
        # --> Test failed (AST guard fallback)
        raise AssertionError("Test failed during agent run: " + "TEST FAILURE The homepage did not progress past the initialization screen and the first chapter and 3D background could not be reached. Observations: - The page remained on the 'Initializing...' screen with the progress indicator at 0% after multiple waits and UI interactions. - Clicking chapter buttons did not advance past the initialization screen. - The hero chapter and the 3D background wer...")
        await asyncio.sleep(5)
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    