<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobListing extends Model
{
    protected $fillable = [
        "employer_id",
        "category_id",
        "title",
        "description",
        "location",
        "work_type",
        "experience_level",
        "salary_min",
        "salary_max",
        "deadline",
        "status",
    ];

    protected $casts = [
        "salary_min" => "integer",
        "salary_max" => "integer",
        "deadline" => "date",
    ];

    public function employer(): BelongsTo
    {
        return $this->belongsTo(User::class, "employer_id");
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, "category_id");
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class, "job_id");
    }
}
