<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class UpdateBploStatus extends Command
{
    protected $signature = 'bplo:update-status';
    protected $description = 'Automatically update BPLO record statuses based on RENEW_TO dates';

    public function handle()
    {
        $bplo = DB::connection('bplo'); // ✅ Use BPLO database

        $now = Carbon::now();
        $nextMonth = $now->copy()->addDays(30);

        // --- 1️⃣ EXPIRED: already past the RENEW_TO date
        $bplo->table('bplo_records')
            ->where('RENEW_TO', '<', $now)
            ->update(['STATUS' => 'Expired']);

        // --- 2️⃣ EXPIRY: within 30 days before expiry
        $bplo->table('bplo_records')
            ->where('RENEW_TO', '>=', $now)
            ->where('RENEW_TO', '<=', $nextMonth)
            ->update(['STATUS' => 'Expiry']);

        // --- 3️⃣ RENEW: still valid beyond 30 days
        $bplo->table('bplo_records')
            ->where('RENEW_TO', '>', $nextMonth)
            ->update(['STATUS' => 'Renew']);

        $this->info('✅ BPLO statuses updated successfully!');
    }
}
