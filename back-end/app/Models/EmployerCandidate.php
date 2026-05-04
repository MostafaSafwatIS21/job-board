<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployerCandidate extends Model
{
    use HasFactory;
    protected $fillable = [
        "user_id",
        "headline",
        "phone",
        "location",
        "resume_url",
        "social_media",
    ];

    protected $casts = [
        "social_media" => "array",
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function candidate(): BelongsTo
    {
        return $this->belongsTo(User::class, "user_id");
    }
}
