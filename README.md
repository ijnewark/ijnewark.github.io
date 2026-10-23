# Indigo Newark — personal website

Plain HTML, CSS and JavaScript. Main pages: Home, Interests (including the interactive connections map), Writing, About and Code. The site follows the device’s light or dark theme automatically, with no manual selector or stored override.

## GitHub Pages package

Use the separate indigo-github-pages.zip deliverable. It has index.html, CSS, JavaScript, posts.json and .github at the repository root, ready for ijnewark/ijnewark.github.io. The source checkout here keeps publishable pages in dist/ for the private Sites preview.

1. Copy the contents of the GitHub package into the root of your repository on main, including the hidden .github folder. Preserve any unrelated files you want to retain. The old connections.html and contact.html pages are no longer needed.
2. In repository Settings → Pages → Build and deployment, choose GitHub Actions as the source.
3. In Actions, run “Refresh writing and publish website” once. Subsequent pushes to main and the hourly schedule deploy automatically.

The workflow checks both Predictive Mind and the personal Substack address at 17 minutes past each hour, independently refreshing up to 20 previews for each. The personal address advertised by the profile is https://indigonewark.substack.com; its /feed currently redirects to the profile rather than returning RSS, so that section intentionally remains empty. Once a valid feed appears at this address, the same job will pick up its posts. If the eventual publication uses another address, update FEEDS in .github/scripts/update-feed.py. This is periodic, not an instant Substack webhook. GitHub may delay scheduled jobs; workflow availability depends on repository/Actions settings. The schedule is not yet installed or activated in your remote repository by this task.

The Python script validates article URLs and writes only plain-text previews. On feed failure it keeps the bundled previews; the page also retains its existing previews if JSON cannot load. The current private Sites preview contains a snapshot. Only the GitHub workflow refreshes it unattended once enabled.

GitHub configuration reference: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages

## CV

The link is labelled “CV” and targets “RS Indigo Newark – CV.pdf” in the repository root. No PDF is bundled. Add your preferred PDF to GitHub using that exact filename.

## Editing

Edit HTML for page content, style.css for appearance and site.js for interactions. The theme always follows the device. Google Fonts have local fallbacks. No accounts, analytics or third-party feed proxies are required.

For local preview, open index.html. Live JSON previews need HTTP hosting; the existing HTML post cards still work from a file URL. The Connections map supports drag, click and keyboard selection; the helper text is available to screen readers only. The colourful home network respects reduced motion.

## Checks

HTML structure, navigation, CV filename, all six connection pairs, new selection clearing, reverse drag, cancellation, network movement and reduced-motion handling checked. Substack script tested against the live feed. Device-theme rules checked; manual selection and stored overrides removed. Physical mobile/touch testing and a remote GitHub Actions run remain unverified.

Recent refinements: all five interests in one section; no repeated page labels or interior separators on Interests/About/Code; links use weight and hover highlighting; Contact uses LinkedIn and mailto:ijnewark@icloud.com. Copy distinguishes interests, exploratory directions and future research ambitions from completed work.
