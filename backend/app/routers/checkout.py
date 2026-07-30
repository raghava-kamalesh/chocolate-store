from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.models.chocolate import Chocolate, Order, OrderItem
from app.schemas.chocolate import GIFT_WRAP_FEE_CENTS, CheckoutIn, CheckoutOut

router = APIRouter()


@router.post("/checkout", response_model=CheckoutOut)
async def checkout(
    body: CheckoutIn,
    session: AsyncSession = Depends(get_db),
) -> CheckoutOut:
    name = body.customer_name.strip()
    if not name:
        raise HTTPException(
            status_code=400, detail="customer_name must not be empty or whitespace"
        )
    gift_message = (body.gift_message or "").strip() or None
    if gift_message and not body.gift_wrap:
        raise HTTPException(
            status_code=400,
            detail="gift_message requires gift_wrap to be true",
        )
    async with session.begin():
        total = 0
        order = Order(
            customer_name=name,
            customer_email=str(body.customer_email).lower(),
            total_cents=0,
            gift_wrap=body.gift_wrap,
            gift_message=gift_message if body.gift_wrap else None,
            status="paid",
        )
        session.add(order)
        await session.flush()

        for line in body.items:
            res = await session.execute(
                select(Chocolate).where(Chocolate.id == line.chocolate_id)
            )
            ch = res.scalar_one_or_none()
            if ch is None:
                raise HTTPException(
                    status_code=400, detail=f"Unknown chocolate {line.chocolate_id}"
                )
            if not ch.in_stock:
                raise HTTPException(
                    status_code=400,
                    detail=f"{ch.name} is out of stock",
                )
            line_total = ch.price_cents * line.quantity
            total += line_total
            session.add(
                OrderItem(
                    order_id=order.id,
                    chocolate_id=ch.id,
                    quantity=line.quantity,
                    unit_price_cents=ch.price_cents,
                )
            )

        if body.gift_wrap:
            total += GIFT_WRAP_FEE_CENTS
        order.total_cents = total

    return CheckoutOut(
        order_id=order.id,
        total_cents=total,
        gift_wrap=body.gift_wrap,
        gift_message=gift_message if body.gift_wrap else None,
    )
