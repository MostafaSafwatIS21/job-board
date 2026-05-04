<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployerProfile extends Model
{
    use HasFactory;
    protected $fillable = [
        "user_id",
        "company_name",
        "company_description",
        "company_website",
        "company_logo",
        "company_location",
    ];

    /**
     * Get the user that owns this employer profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
