<?php

namespace App\Models;

use Spatie\Permission\Models\Permission as SpatiePermission;
use App\Traits\HasAuditTrails;

class Permission extends SpatiePermission
{
    use HasAuditTrails;

    public $guarded = ['id'];

    protected $fillable = [
        'name',
        'guard_name',
        'display_name',
        'group_name',
        'status',
        'updated_at',
        'created_at',
    ];
}
