# Study Hub: founding plan

As of 17 November 2026. Companion to the [README](../README.md), which covers the problem, vision, roadmap and business model.

## Product requirements for the multi-university platform

Each university becomes a "campus" with its own courses, documents and notices, all on one codebase, with one student account that works everywhere.

| ID | Requirement | Priority | Phase |
| --- | --- | --- | --- |
| P1 | Campus model: university, college, programme, semester, subject; URLs like `/u/panjab/bca/sem-3` | Must | 2 |
| P2 | Admin upload with metadata, bulk import, OCR for scanned PDFs, duplicate detection | Must | 1 |
| P3 | Source link and status on every document: Official, Verified or Student-submitted | Must | 1 |
| P4 | Notices feed per campus, with web push alerts | Must | 1 |
| P5 | Search across papers, with unit-wise topic tags | Must | 1 |
| P6 | Ask AI that answers only from campus documents, cites the page, and says when it has no source | Must | 1 |
| P7 | Students submit papers into a moderator queue, with credit | Must | 2 |
| P8 | Report-an-error and takedown form, handled within 48 hours | Must | 1 |
| P9 | Moderator and admin roles for each campus | Must | 2 |
| P10 | Hindi and Punjabi interface; first load under 200 KB | Must | 3 |
| P11 | Topic frequency, such as "Normalization asked in 4 of the last 5 papers" | Should | 2 |
| P12 | Exam mode: a countdown and study plan built from the datesheet | Should | 3 |
| P13 | Android app, starting as a packaged web app | Should | 3 |
| P14 | AI practice papers built from the syllabus, clearly marked as practice | Could | 4 |
| P15 | Dashboard for partner colleges | Could | 4 |
| P16 | Public API for universities | Could | 5 |

Out of scope: a coaching marketplace, selling answer keys, and a social feed.

## Architecture

| Layer | Components |
| --- | --- |
| Students and staff | Installable web app (phone-first), Android app (Phase 3), admin console |
| App layer (Next.js on Vercel) | Pages and API, sign-in and roles, AI answer service that retrieves sources and then cites them |
| Background services | Ingestion workers (OCR, tagging, duplicate checks), search index, notifications |
| Data and outside services | Database where every row carries a campus id, file storage and CDN for PDFs, swappable AI model and web search providers |

## Go-to-market

We launch each university four weeks before its exams, through students already on campus.

- **Search:** a page for every paper, such as "PU BCA Sem 3 DBMS question paper 2024".
- **Campus ambassadors:** one per college. They collect papers and share links in class groups, and earn certificates, credit on the site and a reference letter.
- **Share cards and short videos:** WhatsApp-ready previews and "most repeated questions" clips.

Playbook for each new university: recruit 5 ambassadors, load 2 years of papers for its 10 biggest programmes, launch 4 weeks before exams, and approach the exam branch after 10,000 monthly students.

Starting launch order (to validate): Panjab University → Punjabi University, Patiala → Guru Nanak Dev University, Amritsar → I.K. Gujral Punjab Technical University → Kurukshetra, Himachal Pradesh, Delhi.

## Legal, copyright and privacy

This is a checklist, not legal advice. Get a lawyer’s opinion before Phase 2.

| Area | What applies | What we do |
| --- | --- | --- |
| Copyright | Under India’s Copyright Act, 1957, question papers and syllabi usually belong to the university. Section 52 allows some educational uses, but its reach for a public website is untested | Link to official copies first; host only with permission or where the university already publishes them; credit every source; remove within 48 hours on request |
| Names and logos | University names and logos belong to the universities | No "PU" in the national brand; no logos; a "not affiliated" notice; a trademark search on the new name |
| Personal data | DPDP Act, 2023 and DPDP Rules, 2025 (notified November 2025, heaviest duties from 14 May 2027, per [The Tribune](https://www.tribuneindia.com/news/business/govt-notifies-digital-personal-data-protection-rules-rollout-in-phases-specified-obligations-for-data-fiduciaries)) | Collect the minimum, clear consent notice, delete on request, a published complaints contact |
| Students under 18 | Verifiable parental consent; no tracking or targeted ads ([SCC Online](https://www.scconline.com/blog/post/2025/12/26/digital-personal-data-protection-rules-2025-key-highlights/)) | Age question at sign-up; under-18s use the app without an account or with consent; no ad tracking for anyone |
| User uploads | Complaint handling under India’s IT Rules, 2021 | A named grievance contact and a log of complaints |
| AI answers | Students may treat answers as official | Label AI answers, always show sources, never present AI text as an official answer key |

## Team

| Role | Type | When |
| --- | --- | --- |
| Founder: product and engineering | Full time | Now |
| Content lead | Part-time student | Phase 1 |
| Campus ambassadors (10, then 30) | Volunteers | Phase 1 |
| Advisors: a PU faculty member and a lawyer | Unpaid | Phase 1 |
| Second full-stack engineer | Full time | Phase 2 |
| Designer | Contract | Phase 2 |
| Content operations and moderators (2 to 4) | Full or part time | Phases 2 to 3 |
| AI engineer | Full time | Phase 3 |
| Partnerships lead | Full time | Phase 4 |

## Budget (rough estimates)

| Year | Main costs | Estimated spend | Funding |
| --- | --- | --- | --- |
| 2027 | Hosting, storage, AI, legal opinion, company registration, ambassador rewards | ₹3 to 5 lakh | Founder, donations, a university incubator |
| 2028 | 1 to 2 salaries, designer, more hosting | ₹15 to 25 lakh | Government seed grant or angel investors |
| 2029 | 5 people, Android app, AI costs | ₹50 to 70 lakh | Seed round; first Plus revenue |
| 2030 | 8 people, partnerships | About ₹1 crore | Seed round, Plus, partnerships |
| 2031 | About 12 people, about ₹30 lakh hosting and AI | About ₹1.4 crore | Revenue at break-even |

## Metrics

North star: **weekly students who open at least one document.**

| End of year | Live universities | Monthly active students | Documents | Share verified | Plus subscribers |
| --- | --- | --- | --- | --- | --- |
| 2027 | 1 to 2 | 25,000 | 5,000 | 50% | 0 |
| 2028 | 4 | 75,000 | 15,000 | 60% | 0 |
| 2029 | 10 | 200,000 | 50,000 | 70% | 2,000 |
| 2030 | 30 | 500,000 | 150,000 | 75% | 10,000 |
| 2031 | 100 | 1,000,000 | 400,000 | 80% | 30,000 |

## Risks

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| A university objects to hosted papers | Medium | High | Link-first policy, permission requests, 48-hour takedown, legal opinion |
| Wrong or outdated datesheet shown | Medium | High | Source link and "last checked" date on every notice; report button; Official and Verified labels |
| AI gives a confident wrong answer | Medium | Medium | Answers only from documents, with citations; says so when no source exists |
| Content supply stalls outside PU | High | High | Ambassador rewards, upload credit, exam-branch partnerships |
| AI costs grow faster than revenue | Medium | Medium | Daily free limit, caching, cheaper models for simple questions |
| Founder runs out of time during studies | High | High | Open-source contributors, a co-founder, strict focus on the 90-day list |
| Existing PYQ sites compete | High | Medium | Win on verified content, live notices and sourced AI |
| Under-18 privacy breach | Low | High | Age question at sign-up, no tracking, minimal data |

## Next 90 days (to 15 February 2027)

- [ ] Replace sample data with real BCA Sem 1 to 6 papers (3 years) and syllabus
- [ ] Extend real content to PU’s 10 largest programmes
- [ ] Sync real PU notices weekly and show a "last checked" date
- [ ] Add a report-an-error and takedown form, and publish the takedown policy
- [ ] Rewrite the privacy notice to DPDP standard and add an age question at sign-up
- [ ] Add privacy-friendly analytics and start measuring monthly active students
- [ ] Set a daily AI limit and a cost dashboard
- [ ] Recruit 10 campus ambassadors
- [ ] Pick the multi-university brand name; check the trademark and buy the domain
- [ ] Book a one-hour copyright consultation with a lawyer
- [ ] Apply to a university incubator or for Startup India recognition
- [ ] Approach one PU department about linking to official papers

## Open questions

- What is the national brand name? "Study Hub" is a working name.
- Non-profit (Section 8 company) or private limited company?
- Does PU already publish past papers online that we can link to?
- Which database, storage and AI provider does the live site use, and what does it cost each month?
- Is there a co-founder or a second regular contributor?
