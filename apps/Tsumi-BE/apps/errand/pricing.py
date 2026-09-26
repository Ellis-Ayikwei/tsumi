"""Commission split for an errand price. Pure: no I/O, the unit-test seam."""


def split_commission(price_pesewas: int, commission_bps: int) -> tuple[int, int]:
    """Return (commission_pesewas, agent_payout_pesewas).

    Commission is floored to the whole pesewa and the agent gets the remainder,
    so the two parts always sum to the price and no money is created or lost.
    """
    if price_pesewas <= 0:
        raise ValueError("price_pesewas must be positive")
    if not 0 <= commission_bps <= 10_000:
        raise ValueError("commission_bps must be between 0 and 10000")
    commission_pesewas = price_pesewas * commission_bps // 10_000
    return commission_pesewas, price_pesewas - commission_pesewas
