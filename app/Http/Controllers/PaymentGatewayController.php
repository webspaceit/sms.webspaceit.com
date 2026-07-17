<?php

namespace App\Http\Controllers;

use App\Models\PaymentGateway;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentGatewayController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('school/payment-gateways/index', [
            'gateways' => PaymentGateway::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'provider_key' => 'required|string|max:255|unique:payment_gateways,provider_key',
            'api_key' => 'nullable|string|max:255',
            'api_secret' => 'nullable|string|max:255',
            'merchant_id' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        if ($validated['is_active'] ?? false) {
            PaymentGateway::where('is_active', true)->update(['is_active' => false]);
        }

        PaymentGateway::create($validated);

        return redirect()->route('payment-gateways.index')
            ->with('success', 'Payment gateway added.');
    }

    public function update(Request $request, PaymentGateway $paymentGateway)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'provider_key' => 'required|string|max:255|unique:payment_gateways,provider_key,' . $paymentGateway->id,
            'api_key' => 'nullable|string|max:255',
            'api_secret' => 'nullable|string|max:255',
            'merchant_id' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        if ($validated['is_active'] ?? false) {
            PaymentGateway::where('is_active', true)->where('id', '!=', $paymentGateway->id)->update(['is_active' => false]);
        }

        $paymentGateway->update($validated);

        return redirect()->route('payment-gateways.index')
            ->with('success', 'Payment gateway updated.');
    }

    public function destroy(PaymentGateway $paymentGateway)
    {
        $paymentGateway->delete();
        return redirect()->route('payment-gateways.index')
            ->with('success', 'Payment gateway deleted.');
    }
}
