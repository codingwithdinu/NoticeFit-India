import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { ShieldCheck, FileText, Link2, Search, AlertTriangle, Upload, CheckCircle2 } from "lucide-react";
import "./styles.css";

const sample = `Summer Internship Programme 2027
Eligible: Undergraduate students currently enrolled in Computer Science, IT, Electronics or related engineering branches.
Year: Students who have completed at least 2 years of their degree by May 2027.
Duration: 8 weeks, June–July 2027.
Deadline: 30 November 2026.
Documents: Resume, college ID, latest marksheet and institute NOC if required.
Apply only through the official organisation careers portal. Do not pay a fee to an individual to secure selection.`;

function App() {
  const [notice, setNotice] = useState("");
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  async function readFile(file) {
    if (!file) return;
    try {
      if (file.type === "text/plain") {
        setNotice(await file.text());
      } else if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
        const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
        let text = "";
        for (let i = 1; i <= Math.min(pdf.numPages, 12); i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map(item => item.str).join(" ") + "\n";
        }
        setNotice(text.trim());
      } else {
        setResult({ error: "Upload a text file or PDF." });
        return;
      }
      setResult(null);
    } catch {
      setResult({ error: "Could not read this PDF. It may be scanned/image-only; paste its text instead." });
    }
  }

  function analyze() {
    setBusy(true);
    window.setTimeout(() => {
      const text = notice.trim();
      if (!text) {
        setResult({ error: "Paste notice text or upload a PDF/TXT file first." });
        setBusy(false);
        return;
      }
      const deadline = text.match(/(?:deadline|last date|apply by|closing date)\s*[:\-]?\s*([^\n.]+)/i);
      const docs = text.match(/(?:documents|required documents)\s*[:\-]?\s*([^\n.]+)/i);
      let domain = "Not provided";
      try { if (url) domain = new URL(url).hostname; } catch { domain = "Invalid URL format"; }
      const warnings = [];
      if (!url) warnings.push("No source URL supplied. Authenticity cannot be confirmed from notice text alone.");
      if (/\b(pay|payment|fee|registration fee|processing fee)\b/i.test(text) && /\b(selection|guaranteed|secure|confirm|offer)\b/i.test(text)) warnings.push("Payment is mentioned alongside selection/offer language. Verify any fee directly with the official organisation.");
      if (/whatsapp/i.test(text) && !url) warnings.push("A WhatsApp reference is present but no official source link was provided.");
      setResult({
        title: text.split("\n").find(line => line.trim())?.slice(0, 90) || "Opportunity notice",
        deadline: deadline?.[1]?.trim() || "Not confidently found — check the original notice",
        documents: docs?.[1]?.trim() || "Not confidently found — review official instructions",
        domain,
        warnings,
        checks: [
          { ok: Boolean(url && domain !== "Invalid URL format"), label: "Source URL supplied", detail: domain },
          { ok: Boolean(deadline), label: "Deadline detected", detail: deadline?.[1]?.trim() || "No clear deadline phrase detected" },
          { ok: Boolean(docs), label: "Documents detected", detail: docs?.[1]?.trim() || "No clear document list detected" },
          { ok: false, label: "Official authenticity", detail: "Not automatically verified. Open the source independently and compare the notice." }
        ]
      });
      setBusy(false);
    }, 350);
  }

  return <div className="app">
    <header className="topbar">
      <a className="brand" href="#"><span className="brand-icon"><ShieldCheck size={22}/></span><span>noticefit<span className="dot">.</span><small>INDIA</small></span></a>
      <nav><a href="#how">How it works</a><a href="#checker">Check a notice</a><a href="#safety">Trust & safety</a></nav>
      <a className="nav-cta" href="#checker">Try the checker ↗</a>
    </header>

    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span/> BUILT FOR STUDENTS IN INDIA</div>
          <h1>Before you apply,<br/>make it <em>NoticeFit.</em></h1>
          <p className="hero-lead">Internships, scholarships and training notices can be confusing. Bring the details into focus before you share documents or spend your time.</p>
          <div className="hero-actions"><a className="primary" href="#checker">Check a notice <Search size={17}/></a><a className="text-link" href="#how">See how it works ↓</a></div>
          <div className="trust-points"><span><CheckCircle2 size={15}/> Browser-side file reading</span><span><CheckCircle2 size={15}/> No login required</span></div>
        </div>
        <div className="hero-art" aria-label="Illustration of a notice being checked">
          <div className="ring ring-one"/><div className="ring ring-two"/>
          <div className="floating-tag tag-top"><ShieldCheck size={16}/> CHECK THE SOURCE</div>
          <div className="notice-card"><div className="paper-mark"><FileText size={23}/></div><div className="paper-line wide"/><div className="paper-line"/><div className="paper-line short"/><div className="paper-rule"/><div className="paper-row"><span>DEADLINE</span><b>Found to review</b></div><div className="paper-row"><span>DOCUMENTS</span><b>Checklist extracted</b></div><div className="paper-status"><CheckCircle2 size={15}/> Review before applying</div></div>
          <div className="floating-tag tag-bottom"><AlertTriangle size={16}/> VERIFY INDEPENDENTLY</div>
        </div>
      </section>

      <section className="stats"><div><b>01</b><span>Paste or upload a notice</span></div><div><b>02</b><span>Find key details</span></div><div><b>03</b><span>Review the warning clues</span></div><div><b>100%</b><span>Clear about limitations</span></div></section>

      <section className="checker section" id="checker">
        <div className="section-heading"><div><div className="eyebrow">NOTICE CHECKER</div><h2>Know what to look for.</h2></div><p>Extract likely details and review basic warning clues. This prototype does not authenticate organisations or make final eligibility decisions.</p></div>
        <div className="checker-grid">
          <div className="panel">
            <div className="panel-title"><span className="step">01</span><div><h3>Add your notice</h3><p>Paste the text or upload a text-based PDF/TXT.</p></div></div>
            <label className="label" htmlFor="source">Source URL <span>optional, but recommended</span></label>
            <div className="url-input"><Link2 size={17}/><input id="source" type="url" placeholder="https://official-organisation.gov.in/..." value={url} onChange={e=>setUrl(e.target.value)}/></div>
            <label className="label" htmlFor="notice">Notice text</label>
            <textarea id="notice" value={notice} onChange={e=>setNotice(e.target.value)} placeholder="Paste the opportunity notice here — eligibility, deadline, required documents..."/>
            <div className="upload-row"><label className="upload"><Upload size={16}/> Upload PDF or TXT<input type="file" accept=".pdf,.txt,text/plain,application/pdf" onChange={e=>readFile(e.target.files?.[0])}/></label><button className="sample" onClick={()=>{setNotice(sample);setUrl("https://example.org/careers");setResult(null)}}>Try sample notice ↗</button></div>
            <button className="primary analyze" onClick={analyze} disabled={busy}>{busy ? "Reviewing notice…" : "Review notice"} <Search size={17}/></button>
            <p className="privacy"><ShieldCheck size={15}/> Files are processed in your browser. Don't upload Aadhaar, bank details or passwords.</p>
          </div>
          <div className="panel result-panel">
            <div className="panel-title"><span className="step">02</span><div><h3>Review summary</h3><p>Detected information and verification gaps.</p></div></div>
            {!result ? <div className="empty"><div className="empty-icon"><FileText size={34}/></div><h3>Your summary will appear here.</h3><p>Start with a notice to surface its likely deadline, document checklist and source gaps.</p><div className="chips"><span>Deadline</span><span>Documents</span><span>Source clues</span></div></div> : result.error ? <div className="error"><AlertTriangle size={24}/><p>{result.error}</p></div> : <div className="result-content">
              <div className="result-kicker">NOTICE REVIEW · NOT AUTHENTICATION</div><h3 className="result-title">{result.title}</h3>
              <div className="summary-item"><span>LIKELY DEADLINE</span><b>{result.deadline}</b></div><div className="summary-item"><span>DOCUMENTS MENTIONED</span><b>{result.documents}</b></div><div className="summary-item"><span>SOURCE DOMAIN</span><b>{result.domain}</b></div>
              <div className="checks">{result.checks.map((c,i)=><div className="check" key={i}><span className={c.ok?"check-icon ok":"check-icon warn"}>{c.ok?<CheckCircle2 size={16}/>:<AlertTriangle size={16}/>}</span><div><b>{c.label}</b><p>{c.detail}</p></div></div>)}</div>
              {result.warnings.length>0 && <div className="warnings"><b><AlertTriangle size={16}/> Review these clues</b>{result.warnings.map((w,i)=><p key={i}>{w}</p>)}</div>}
              <div className="disclaimer">A source URL being present does not mean it is official. Verify the organisation and deadline independently.</div>
            </div>}
          </div>
        </div>
      </section>

      <section className="how section" id="how"><div className="eyebrow">SIMPLE BY DESIGN</div><h2>Three steps. Better-informed decisions.</h2><div className="how-grid"><article><span>01</span><h3>Bring the notice</h3><p>Paste text or upload a text-based PDF/TXT file. The prototype reads the first 12 PDF pages in your browser.</p></article><article><span>02</span><h3>Surface the details</h3><p>See likely deadline and document phrases without treating pattern matching as authoritative information.</p></article><article><span>03</span><h3>Verify independently</h3><p>Use the source link to check the organisation's official website and confirm all requirements before applying.</p></article></div></section>

      <section className="safety section" id="safety"><div className="safety-icon"><ShieldCheck size={25}/></div><div><h3>Helpful clues, not a guarantee.</h3><p>NoticeFit India is an early prototype, not a scam detector. It does not crawl official websites, verify identity, check live deadlines or make authoritative eligibility decisions. Missing evidence means unverified — not necessarily fake.</p></div></section>
    </main>
    <footer><a className="brand" href="#"><span className="brand-icon"><ShieldCheck size={19}/></span><span>noticefit<span className="dot">.</span><small>INDIA</small></span></a><p>Verify before you apply.</p><span>Early prototype · MIT License</span></footer>
  </div>;
}

createRoot(document.getElementById("root")).render(<App/>);