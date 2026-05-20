<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBidRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'proposed_price'     => ['required', 'numeric', 'min:1', 'max:1000000'],
            'delivery_days'      => ['required', 'integer', 'min:1', 'max:365'],
            'cover_letter'       => ['required', 'string', 'min:30', 'max:5000'],
            'experience_summary' => ['required', 'string', 'min:20', 'max:2000'],
        ];
    }

    public function messages(): array
    {
        return [
            'cover_letter.min'       => 'Please write a cover letter of at least 30 characters so the client understands your proposal.',
            'experience_summary.min' => 'Briefly describe your relevant experience (at least 20 characters).',
        ];
    }
}
