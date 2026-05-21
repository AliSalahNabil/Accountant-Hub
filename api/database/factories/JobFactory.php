<?php

namespace Database\Factories;

use App\Models\Job;
use App\Models\JobCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Job>
 */
class JobFactory extends Factory
{
    /**
     * Realistic accounting job templates (title + short + full description).
     * Picked at random by definition() so seeded data reads like real postings,
     * not Lorem Ipsum.
     */
    private const TEMPLATES = [
        [
            'title' => 'Monthly Bookkeeping for E-commerce Store',
            'short' => 'Looking for an experienced bookkeeper to manage monthly transactions, reconciliations, and reporting for a growing Shopify store.',
            'desc'  => "We run a fast-growing Shopify business processing 400–600 orders per month across the US and EU. Our books have been kept in QuickBooks Online but need a steady hand going forward.\n\n**What we need:**\n\n- Categorize and reconcile all bank, Stripe, and PayPal transactions monthly\n- Track inventory cost of goods sold using FIFO\n- Reconcile sales-tax collected vs. remitted (Avalara)\n- Deliver a monthly P&L, balance sheet, and cashflow statement by the 7th of the following month\n\n**About us:**\n\nWe're a 6-person team, US-based with EU contractors. Communication is on Slack. We value accuracy, on-time delivery, and clear monthly summaries that non-finance founders can act on.",
        ],
        [
            'title' => 'Annual Tax Return Preparation',
            'short' => 'Need a CPA to prepare and file federal + state corporate tax returns for FY 2025, plus K-1s for three shareholders.',
            'desc'  => "Our SaaS company (Delaware C-Corp, single state of operation in CA) needs end-to-end preparation of the FY 2025 tax returns.\n\n**Scope of work:**\n\n- Federal Form 1120 with all schedules\n- California Form 100 + CA-specific adjustments\n- K-1s for three shareholders\n- R&D tax credit (Form 6765) — we have ~\$180K of qualified expenses\n- Estimated quarterly filings for the upcoming year\n\n**About us:**\n\nWe're a Series-A B2B SaaS company with \$3.4M ARR, 14 employees, and clean GAAP books in NetSuite. Prior year's return is available for review.",
        ],
        [
            'title' => 'QuickBooks Setup and Migration',
            'short' => 'Migrating from spreadsheets to QuickBooks Online. Need someone to set up the chart of accounts, import history, and train our team.',
            'desc'  => "We've been running our small business on a mix of Excel and Wave for the last 18 months and it's time to move to QuickBooks Online.\n\n**What we need:**\n\n- Design a chart of accounts tailored to our industry (professional services)\n- Import 18 months of historical transactions and reconcile against bank statements\n- Set up recurring invoices, expense rules, and bank feeds\n- Run a 2-hour Zoom training session for our office manager\n\n**About us:**\n\nWe're a 12-person consulting firm with simple but consistent month-end needs. Reasonable budget, clear deliverables, and a friendly team.",
        ],
        [
            'title' => 'Audit Support for SaaS Startup',
            'short' => 'Preparing for our first external audit. Need an experienced accountant to help organize records and answer auditor PBC requests.',
            'desc'  => "We're a Series-B SaaS company going through our first external audit (PCAOB-equivalent for our enterprise customers). The audit firm has been selected; we need internal support to make the engagement smooth.\n\n**Responsibilities:**\n\n- Organize and tie out the PBC (Provided by Client) list — ~80 items\n- Reconcile revenue per ASC 606 across our subscription book\n- Document internal controls over financial reporting\n- Be the day-to-day point of contact for the audit team for 4–6 weeks\n\n**Ideal candidate:**\n\nCPA with prior Big-4 audit experience and at least one SaaS audit cycle behind them.",
        ],
        [
            'title' => 'Payroll Processing for 25 Employees',
            'short' => 'Bi-weekly payroll for a 25-person team across three US states. Looking for someone reliable to take this off our plate.',
            'desc'  => "We currently run payroll in-house on Gusto, but our COO is stretched thin and we'd like to outsource the recurring work to a dedicated specialist.\n\n**What's involved:**\n\n- Bi-weekly payroll runs for 22 W-2 employees and 3 contractors\n- Multi-state withholdings: CA, TX, NY\n- Monthly 401(k) contributions and remittances\n- Quarterly 941 filings and year-end W-2/1099 preparation\n\n**About us:**\n\nWe're a remote-first marketing agency. Communication is async-friendly. We need someone responsive but the day-to-day work is predictable.",
        ],
        [
            'title' => 'Financial Statements Cleanup',
            'short' => 'Books are in QuickBooks Desktop and have not been reconciled in 8 months. Need an experienced accountant to bring them current.',
            'desc'  => "Our previous bookkeeper left abruptly and the books haven't been touched since. We need someone to come in, diagnose the state of things, and bring everything current.\n\n**Scope:**\n\n- Reconcile 8 months of bank and credit card statements\n- Investigate and clear ~30 suspense-account entries\n- Re-categorize miscoded vendor bills\n- Produce clean monthly P&L and balance sheet for the last 12 months\n\nWe'd like to evaluate whether QuickBooks Online would be a better long-term fit — your recommendation welcome.",
        ],
        [
            'title' => 'VAT Filing and Reconciliation',
            'short' => 'UK Ltd company needs quarterly VAT returns prepared and submitted via MTD-compatible software. Also a backlog of 2 quarters to clean up.',
            'desc'  => "We're a UK-incorporated e-commerce business selling B2C in the UK and EU. VAT compliance has fallen behind and we need an experienced UK accountant to take ownership.\n\n**Deliverables:**\n\n- Reconcile the last 2 quarters of VAT against Shopify, Amazon, and bank feeds\n- File outstanding quarterly returns through MTD-compatible software (we use FreeAgent)\n- Set up a repeatable process for the team going forward\n- Brief monthly compliance check-in\n\n**About us:**\n\nA 4-person UK Ltd shipping handmade goods globally. Annual revenue around £420K. Friendly, responsive team.",
        ],
        [
            'title' => 'Year-end Closing and Reporting',
            'short' => 'Need a senior accountant to lead year-end close: accruals, prepaids, depreciation, intercompany eliminations, and management reporting.',
            'desc'  => "Our fiscal year ends December 31 and we'd like to engage a senior accountant to own the close cycle from start to finish.\n\n**What's expected:**\n\n- Book accruals, prepaids, depreciation, and reserves per US GAAP\n- Run intercompany eliminations across 2 entities (US parent + EU subsidiary)\n- Produce a board-ready package: P&L, BS, cashflow, KPI dashboard, and variance commentary\n- Coordinate with the external audit firm where needed\n\n**Timeline:**\n\nKickoff in early January, draft close by Jan 20, finalized package by Jan 31.",
        ],
        [
            'title' => 'Forensic Accounting Investigation',
            'short' => 'Engagement for a confidential investigation into potential vendor over-billing. Discretion and documentation are critical.',
            'desc'  => "Our internal controls team has flagged a pattern of vendor invoices that appear to have been inflated over a 14-month window. We need an experienced forensic accountant to investigate.\n\n**Scope of engagement:**\n\n- Review of ~600 vendor invoices and matching POs/receipts\n- Interviews with relevant staff (coordinated with HR)\n- Quantification of any overbilling and a written report suitable for legal counsel\n- Recommendations to strengthen the procure-to-pay control environment\n\n**Confidentiality:**\n\nAn NDA is required before scope details are shared. References from at least one prior forensic engagement requested.",
        ],
        [
            'title' => 'IFRS Conversion Project',
            'short' => 'US GAAP to IFRS conversion for our European subsidiary. Includes drafting accounting policies and restating two prior years.',
            'desc'  => "Our European subsidiary is required to report under IFRS for local statutory purposes. We currently keep books in US GAAP and need a structured conversion.\n\n**Project deliverables:**\n\n- Gap analysis between current US GAAP treatment and IFRS for each material account\n- Draft IFRS accounting policy memos for revenue (IFRS 15), leases (IFRS 16), and impairment (IAS 36)\n- Restate two prior years' financials under IFRS\n- Train our local controller on ongoing IFRS book maintenance\n\n**About us:**\n\nMid-market manufacturer with ~\$45M revenue. Books in NetSuite. We have a competent local team — they just need a guide.",
        ],
        [
            'title' => '3-Statement Financial Model & 5-Year Forecast',
            'short' => 'Build a clean, board-ready 3-statement financial model for our next fundraising round. Driver-based, fully linked.',
            'desc'  => "We're preparing for a Series-A raise in Q3 and need a polished financial model to share with prospective investors.\n\n**Model requirements:**\n\n- 5-year forecast with monthly granularity for years 1–2, quarterly after\n- Fully linked P&L, balance sheet, and cashflow statement\n- Driver-based — pricing, headcount, churn, CAC payback all editable inputs\n- Three scenarios: base, upside, downside\n- Investor-ready summary tab with cohort charts\n\nWe'll provide historical financials, current revenue book, and our hiring plan. Familiarity with SaaS metrics (ARR, NRR, magic number) required.",
        ],
        [
            'title' => 'Bi-weekly Payroll for 40-person team (Multi-state)',
            'short' => 'Established company with payroll in Gusto needs ongoing bi-weekly processing, tax filings, and year-end W-2s.',
            'desc'  => "Looking for a payroll specialist to take ownership of our recurring payroll operations.\n\n**What we need:**\n\n- Bi-weekly payroll runs for 40 W-2 employees across CA, NY, TX, and FL\n- Quarterly 941 and state-level filings\n- Annual W-2 issuance and 1099 management for ~12 contractors\n- Monthly headcount / payroll cost report to leadership\n\nWe pay competitive monthly retainers for accountants we trust. Long-term engagement preferred.",
        ],
        [
            'title' => 'External Audit Support — 12 month engagement',
            'short' => 'Manufacturer needs hands-on audit liaison support throughout the year, not just at year-end.',
            'desc'  => "We engaged a new audit firm this year and want a year-round liaison to keep the audit trail clean instead of scrambling at year-end.\n\n**Engagement scope:**\n\n- Quarterly review of journal entries and supporting documentation\n- Maintain the audit binder (revenue, AR aging, inventory, fixed assets)\n- Walkthrough memos for material processes\n- Be the auditor's primary point of contact during interim and year-end fieldwork\n\nThis is a 12-month engagement with the option to renew. We have a clean ERP environment in NetSuite.",
        ],
    ];

    public function definition(): array
    {
        $template = fake()->randomElement(self::TEMPLATES);
        $min = fake()->randomElement([300, 500, 1000, 1500, 2500, 5000]);
        $max = $min + fake()->randomElement([200, 500, 1000, 2500]);

        return [
            'category_id'       => JobCategory::inRandomOrder()->value('id') ?? JobCategory::factory(),
            'title'             => $template['title'] . ' #' . fake()->numberBetween(100, 999),
            'company_name'      => fake()->company(),
            'company_logo'      => null,
            'company_location'  => fake()->city() . ', ' . fake()->country(),
            'short_description' => $template['short'],
            'description'       => $template['desc'],
            'required_skills'   => fake()->randomElements([
                'QuickBooks', 'Xero', 'SAP', 'Excel', 'Tax Filing', 'Audit', 'IFRS', 'GAAP',
                'Bookkeeping', 'Payroll', 'VAT', 'Financial Reporting', 'Reconciliation', 'NetSuite',
            ], fake()->numberBetween(3, 6)),
            'budget_min'        => $min,
            'budget_max'        => $max,
            'currency'          => 'USD',
            'delivery_days'     => fake()->randomElement([7, 14, 21, 30, 45, 60]),
            'deadline'          => fake()->dateTimeBetween('+1 week', '+3 months')->format('Y-m-d'),
            'attachments'       => [],
            'status'            => fake()->randomElement([
                Job::STATUS_OPEN, Job::STATUS_OPEN, Job::STATUS_OPEN, Job::STATUS_OPEN, Job::STATUS_CLOSED,
            ]),
        ];
    }

    public function open(): static
    {
        return $this->state(fn () => ['status' => Job::STATUS_OPEN]);
    }

    public function closed(): static
    {
        return $this->state(fn () => ['status' => Job::STATUS_CLOSED]);
    }
}
