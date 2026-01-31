<?php

namespace App\Models;

use Spatie\Permission\Models\Role as SpatieRole;
use App\Traits\HasAuditTrails;

class Role extends SpatieRole
{
    use HasAuditTrails;

    public $guarded = ['id'];
    
    // Ensure new columns are fillable if not using guarded
    protected $fillable = [
        'name',
        'guard_name',
        'group_name',
        'status',
        'updated_at',
        'created_at',
    ];
}
