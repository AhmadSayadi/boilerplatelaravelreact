<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\HasAuditTrails;

class Product extends Model
{
    use HasFactory, SoftDeletes, HasAuditTrails;

    protected $fillable = [
        'name',
        'sku',
        'category',
        'price',
        'stock',
        'description',
        'image',
        'status',
    ];

    protected $casts = [
        'price' => 'integer',
        'stock' => 'integer',
    ];
}
