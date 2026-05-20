<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class JobIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search'       => ['nullable', 'string', 'max:120'],
            'category'     => ['nullable', 'string', 'max:120'],
            'budget_min'   => ['nullable', 'numeric', 'min:0'],
            'budget_max'   => ['nullable', 'numeric', 'gte:budget_min'],
            'status'       => ['nullable', 'in:open,closed,all'],
            'sort'         => ['nullable', 'in:newest,oldest,budget_high,budget_low,deadline'],
            'per_page'     => ['nullable', 'integer', 'min:1', 'max:50'],
            'page'         => ['nullable', 'integer', 'min:1'],
        ];
    }
}
