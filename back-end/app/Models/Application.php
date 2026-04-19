<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Application extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        "job_id",
        "candidate_id",
        "links",
        "cover_letter",
        "status",
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        "links" => "array",
    ];

    /**
     * Get the related job listing for this application.
     */
    public function job(): BelongsTo
    {
        return $this->belongsTo(JobListing::class, "job_id");
    }

    /**
     * Get the candidate (user) who submitted this application.
     */
    public function candidate(): BelongsTo
    {
        return $this->belongsTo(User::class, "candidate_id");
    }
}
