<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create("job_listings", function (Blueprint $table) {
            $table->id();
            $table
                ->foreignId("employer_id")
                ->constrained("users")
                ->onDelete("cascade")
                ->onUpdate("cascade");
            $table
                ->foreignId("category_id")
                ->constrained("categories")
                ->onDelete("cascade")
                ->onUpdate("cascade");
            $table->string("title");
            $table->text("description");
            $table->string("location");
            $table->enum("work_type", ["remote", "on_site"]);
            $table->enum("experience_level", [
                "entry_level",
                "mid_level",
                "senior_level",
                "executive_level",
            ]);
            $table->integer("salary_min");
            $table->integer("salary_max");
            $table->date("deadline");
            $table->enum("status", [
                "draft",
                "pending",
                "approved",
                "rejected",
                "closed",
            ]);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("job_listings");
    }
};
