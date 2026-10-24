# NoticeFit India

**Verify before you apply.** NoticeFit is an early student-focused prototype for reviewing internship, scholarship and training notices.

## MVP features
- Paste notice text or upload a text-based PDF/TXT.
- Browser-side PDF text extraction with PDF.js (up to 12 pages).
- Extract likely deadline and document-list phrases.
- Basic, transparent warning clues and missing-source warnings.
- Personal checklist inputs for study status, branch and NOC policy.
- No login, database, paid AI API or server-side file upload.

## Important limitations
This prototype does **not** verify an organisation's identity, crawl official websites, check live deadlines, or make authoritative eligibility decisions. It uses simple text patterns and is not a scam detector. A missing official source means **unverified**, not fake. The sample URL is illustrative and must not be treated as a real opportunity.

## Run locally
Requirements: Node.js 18+.

```bash
npm install
npm run dev
```

Build for deployment:

```bash
npm run build
npm run preview
```

## Deploy
The project is a Vite static site and can be deployed to Cloudflare Pages or Vercel. Build command: `npm run build`; output directory: `dist`.

## Roadmap
1. Validate with 20–30 students and real, public notices.
2. Add safe source-domain allowlists and explicit official-source evidence.
3. Compare notice versions and highlight changes.
4. Add structured eligibility rules with quoted source clauses.
5. Add optional reminders and saved reports only after privacy review.

## Privacy principles
- Process uploads in the browser.
- Don't request Aadhaar, bank details, passwords or other sensitive documents.
- Never present automated pattern matching as government or employer verification.

## License
MIT