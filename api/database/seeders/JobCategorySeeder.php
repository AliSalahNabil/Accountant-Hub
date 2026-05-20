<?php

namespace Database\Seeders;

use App\Models\JobCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class JobCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Bookkeeping',           'icon' => 'BookOpen',   'description' => 'Day-to-day record keeping, transaction categorization, and reconciliations.'],
            ['name' => 'Tax Preparation',       'icon' => 'Receipt',    'description' => 'Corporate, personal, VAT, and sales tax preparation and filing.'],
            ['name' => 'Audit & Assurance',     'icon' => 'ShieldCheck','description' => 'Internal audits, external audit support, and SOC engagements.'],
            ['name' => 'Payroll',               'icon' => 'Users',      'description' => 'Payroll processing, payroll tax, and benefits administration.'],
            ['name' => 'Financial Analysis',    'icon' => 'TrendingUp', 'description' => 'Forecasting, budgeting, and financial modeling.'],
            ['name' => 'Forensic Accounting',   'icon' => 'Search',     'description' => 'Fraud investigations, litigation support, and financial disputes.'],
            ['name' => 'Management Accounting', 'icon' => 'BarChart',   'description' => 'Cost accounting, KPI reporting, and management dashboards.'],
            ['name' => 'IFRS & GAAP',           'icon' => 'FileText',   'description' => 'Standards conversion, technical accounting, and compliance.'],
        ];

        foreach ($categories as $category) {
            JobCategory::updateOrCreate(
                ['slug' => Str::slug($category['name'])],
                $category + ['slug' => Str::slug($category['name'])]
            );
        }
    }
}
