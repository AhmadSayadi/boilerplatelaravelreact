<?php

namespace App\Traits;

use Illuminate\Support\Facades\Auth;

trait HasAuditTrails
{
    public static function bootHasAuditTrails()
    {
        static::creating(function ($model) {
            if (Auth::check()) {
                $model->created_by = Auth::user()->username;
                $model->created_location = Auth::user()->location ?? null;
            }
        });

        static::updating(function ($model) {
            if (Auth::check()) {
                $model->updated_by = Auth::user()->username;
                $model->updated_location = Auth::user()->location ?? null;
            }
        });

        static::deleting(function ($model) {
            // Only useful if using SoftDeletes, but good to have
            if (in_array('Illuminate\Database\Eloquent\SoftDeletes', class_uses($model))) {
                if (Auth::check()) {
                    $model->deleted_by = Auth::user()->username;
                    $model->deleted_location = Auth::user()->location ?? null;
                    $model->saveQuietly(); // Prevent infinite loop if saving triggers updating
                }
            }
        });
    }
}
