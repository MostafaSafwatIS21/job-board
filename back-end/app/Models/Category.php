<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ["name"];

    /**
     * Get all job listings that belong to this category.
     */
    public function jobListings(): HasMany
    {
        return $this->hasMany(JobListing::class, "category_id");
    }
}
