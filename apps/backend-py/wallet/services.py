"""Payment integration services for Paystack and Mobile Money"""
import requests
import uuid
from django.conf import settings
from .models import Transaction


class PaymentService:
    """Handle payment processing with Paystack"""

    def __init__(self):
        self.paystack_secret = settings.PAYSTACK_SECRET_KEY
        self.paystack_base_url = settings.PAYSTACK_BASE_URL

    def initiate_deposit(self, wallet, amount, provider="paystack"):
        """Initiate a deposit transaction"""
        reference = f"DEP-{uuid.uuid4().hex[:12].upper()}"

        # Create pending transaction
        transaction = Transaction.objects.create(
            wallet=wallet,
            amount=amount,
            transaction_type="deposit",
            status="pending",
            reference=reference,
            provider=provider,
            description=f"Deposit to wallet via {provider}",
        )

        if provider == "paystack":
            return self._initialize_paystack_payment(transaction)
        else:
            return {
                "status": "pending",
                "reference": reference,
                "message": "Mobile Money deposit initiated",
            }

    def _initialize_paystack_payment(self, transaction):
        """Initialize Paystack payment"""
        url = f"{self.paystack_base_url}/transaction/initialize"
        headers = {
            "Authorization": f"Bearer {self.paystack_secret}",
            "Content-Type": "application/json",
        }
        payload = {
            "email": transaction.wallet.user.email,
            "amount": int(float(transaction.amount) * 100),  # Convert to pesewas
            "reference": transaction.reference,
            "callback_url": f"{settings.ALLOWED_HOSTS[0]}/api/wallet/verify-payment/",
        }

        try:
            response = requests.post(url, json=payload, headers=headers)
            data = response.json()

            if data.get("status"):
                transaction.provider_reference = data["data"]["reference"]
                transaction.save()
                return {
                    "status": "success",
                    "authorization_url": data["data"]["authorization_url"],
                    "reference": transaction.reference,
                }
            else:
                transaction.status = "failed"
                transaction.save()
                raise Exception(data.get("message", "Payment initialization failed"))
        except Exception as e:
            transaction.status = "failed"
            transaction.save()
            raise e

    def verify_payment(self, reference):
        """Verify Paystack payment and credit wallet"""
        url = f"{self.paystack_base_url}/transaction/verify/{reference}"
        headers = {"Authorization": f"Bearer {self.paystack_secret}"}

        try:
            response = requests.get(url, headers=headers)
            data = response.json()

            if data.get("status") and data["data"]["status"] == "success":
                transaction = Transaction.objects.get(provider_reference=reference)
                transaction.status = "completed"
                transaction.save()

                # Credit wallet
                wallet = transaction.wallet
                wallet.balance += transaction.amount
                wallet.save()

                return {"status": "success", "message": "Payment verified"}
            else:
                return {"status": "failed", "message": "Payment verification failed"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

    def initiate_withdrawal(self, wallet, amount, account_number, bank_code=None):
        """Initiate withdrawal from wallet"""
        reference = f"WDR-{uuid.uuid4().hex[:12].upper()}"

        transaction = Transaction.objects.create(
            wallet=wallet,
            amount=amount,
            transaction_type="withdrawal",
            status="pending",
            reference=reference,
            provider="paystack",
            description="Withdrawal from wallet",
        )

        # Deduct from wallet immediately
        wallet.balance -= amount
        wallet.save()

        # In production, integrate with Paystack Transfer API
        transaction.status = "completed"
        transaction.save()

        return {
            "status": "success",
            "reference": reference,
            "message": "Withdrawal initiated",
        }


