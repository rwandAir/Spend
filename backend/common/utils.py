from decimal import Decimal

def format_currency(amount, currency="RWF"):
    """
    Format decimal amount as currency string.
    """
    dec_val = Decimal(str(amount))
    return f"{currency} {dec_val:,.0f}"
