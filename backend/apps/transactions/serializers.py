from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    transaction_id = serializers.ReadOnlyField()
    id = serializers.ReadOnlyField(source='transaction_id')
    transaction_date = serializers.SerializerMethodField()
    type = serializers.ReadOnlyField(source='transaction_type')
    description = serializers.ReadOnlyField(source='category')
    created_at = serializers.SerializerMethodField()

    class Meta:
        model = Transaction
        fields = [
            'id', 'transaction_id', 'transaction_date', 'created_at',
            'category', 'description', 'amount', 'transaction_type', 'type',
            'payment_method'
        ]

    def get_transaction_date(self, obj):
        return obj.created_at.strftime('%Y-%m-%d')

    def get_created_at(self, obj):
        # Return format YYYY-MM-DD
        return obj.created_at.strftime('%Y-%m-%d')
