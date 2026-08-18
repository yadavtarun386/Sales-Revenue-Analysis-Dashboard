import math

def format_inr(value: float, compact: bool = False) -> str:
    """
    Format a numeric value as Indian Rupee currency.
    Examples:
        format_inr(25000) -> "₹25,000"
        format_inr(125000) -> "₹1.25 Lakh"
        format_inr(24000000) -> "₹2.40 Crore"
        format_inr(125000, compact=True) -> "₹1.25L"
    """
    if value is None or (isinstance(value, float) and math.isnan(value)):
        return "₹0"
    
    val = float(value)
    is_negative = val < 0
    val = abs(val)
    
    if compact:
        if val >= 1_00_00_000: # 1 Crore = 10,000,000
            res = f"₹{val / 1_00_00_000:.2f}Cr"
        elif val >= 1_00_000: # 1 Lakh = 100,000
            res = f"₹{val / 1_00_000:.2f}L"
        elif val >= 1_000:
            res = f"₹{val / 1_000:.1f}K"
        else:
            res = f"₹{val:.0f}"
        return f"-{res}" if is_negative else res

    if val >= 1_00_00_000:
        cr = val / 1_00_00_000
        res = f"₹{cr:.2f} Crore"
    elif val >= 1_00_000:
        lakh = val / 1_00_000
        res = f"₹{lakh:.2f} Lakh"
    else:
        # Standard Indian comma grouping (3 digits at end, then groups of 2)
        s = f"{val:.2f}"
        parts = s.split('.')
        integer_part = parts[0]
        decimal_part = parts[1] if len(parts) > 1 else "00"
        
        if len(integer_part) <= 3:
            formatted_int = integer_part
        else:
            last_three = integer_part[-3:]
            other_digits = integer_part[:-3]
            # group rest by 2
            groups = []
            while len(other_digits) > 0:
                groups.insert(0, other_digits[-2:])
                other_digits = other_digits[:-2]
            formatted_int = ",".join(groups) + "," + last_three
            
        if decimal_part == "00":
            res = f"₹{formatted_int}"
        else:
            res = f"₹{formatted_int}.{decimal_part}"

    return f"-{res}" if is_negative else res

def format_number_inr(val: float) -> str:
    """Format integer/number with Indian commas."""
    if val is None or math.isnan(val):
        return "0"
    val_int = int(round(val))
    s = str(abs(val_int))
    if len(s) <= 3:
        formatted = s
    else:
        last_three = s[-3:]
        other = s[:-3]
        groups = []
        while len(other) > 0:
            groups.insert(0, other[-2:])
            other = other[:-2]
        formatted = ",".join(groups) + "," + last_three
    return f"-{formatted}" if val_int < 0 else formatted
