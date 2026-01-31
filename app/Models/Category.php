<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\HasAuditTrails;

class Category extends Model
{
    use HasFactory, SoftDeletes, HasAuditTrails;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'image',
        'parent_id',
        'status',
        'created_by',
        'created_location',
        'updated_by',
        'updated_location',
        'deleted_by',
        'deleted_location',
    ];
}
