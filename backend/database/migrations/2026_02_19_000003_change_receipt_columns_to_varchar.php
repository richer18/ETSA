<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        if (Schema::hasTable('purchase_accountable_forms')) {
            DB::statement("
                ALTER TABLE `purchase_accountable_forms`
                MODIFY COLUMN `Receipt_Range_From` VARCHAR(30) NOT NULL,
                MODIFY COLUMN `Receipt_Range_To` VARCHAR(30) NOT NULL
            ");
        }

        if (Schema::hasTable('issued_accountable_forms')) {
            DB::statement("
                ALTER TABLE `issued_accountable_forms`
                MODIFY COLUMN `Receipt_Range_From` VARCHAR(30) NOT NULL DEFAULT '0',
                MODIFY COLUMN `Receipt_Range_To` VARCHAR(30) NOT NULL DEFAULT '0',
                MODIFY COLUMN `Begginning_Balance_receipt_from` VARCHAR(30) NOT NULL DEFAULT '0',
                MODIFY COLUMN `Begginning_Balance_receipt_to` VARCHAR(30) NOT NULL DEFAULT '0',
                MODIFY COLUMN `Ending_Balance_receipt_from` VARCHAR(30) NOT NULL DEFAULT '0',
                MODIFY COLUMN `Ending_Balance_receipt_to` VARCHAR(30) NOT NULL DEFAULT '0',
                MODIFY COLUMN `Issued_receipt_from` VARCHAR(30) NOT NULL DEFAULT '0',
                MODIFY COLUMN `Issued_receipt_to` VARCHAR(30) NOT NULL DEFAULT '0'
            ");
        }

        if (Schema::hasTable('rcd_issued_form')) {
            DB::statement("
                ALTER TABLE `rcd_issued_form`
                MODIFY COLUMN `receipt_no_from` VARCHAR(30) NOT NULL,
                MODIFY COLUMN `receipt_no_to` VARCHAR(30) NOT NULL
            ");
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        if (Schema::hasTable('purchase_accountable_forms')) {
            DB::statement("
                ALTER TABLE `purchase_accountable_forms`
                MODIFY COLUMN `Receipt_Range_From` BIGINT UNSIGNED NOT NULL,
                MODIFY COLUMN `Receipt_Range_To` BIGINT UNSIGNED NOT NULL
            ");
        }

        if (Schema::hasTable('issued_accountable_forms')) {
            DB::statement("
                ALTER TABLE `issued_accountable_forms`
                MODIFY COLUMN `Receipt_Range_From` BIGINT UNSIGNED NOT NULL DEFAULT 0,
                MODIFY COLUMN `Receipt_Range_To` BIGINT UNSIGNED NOT NULL DEFAULT 0,
                MODIFY COLUMN `Begginning_Balance_receipt_from` BIGINT UNSIGNED NOT NULL DEFAULT 0,
                MODIFY COLUMN `Begginning_Balance_receipt_to` BIGINT UNSIGNED NOT NULL DEFAULT 0,
                MODIFY COLUMN `Ending_Balance_receipt_from` BIGINT UNSIGNED NOT NULL DEFAULT 0,
                MODIFY COLUMN `Ending_Balance_receipt_to` BIGINT UNSIGNED NOT NULL DEFAULT 0,
                MODIFY COLUMN `Issued_receipt_from` BIGINT UNSIGNED NOT NULL DEFAULT 0,
                MODIFY COLUMN `Issued_receipt_to` BIGINT UNSIGNED NOT NULL DEFAULT 0
            ");
        }

        if (Schema::hasTable('rcd_issued_form')) {
            DB::statement("
                ALTER TABLE `rcd_issued_form`
                MODIFY COLUMN `receipt_no_from` BIGINT UNSIGNED NOT NULL,
                MODIFY COLUMN `receipt_no_to` BIGINT UNSIGNED NOT NULL
            ");
        }
    }
};
