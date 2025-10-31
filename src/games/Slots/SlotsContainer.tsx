import React from 'react'
import { StyledSlots } from './slots.styles'
import { Slot } from './slot'
import { SLOT_ITEMS } from './constants'  // falls du konstante Slot-Items nutzt

export const SlotsContainer = () => {
  return (
    <StyledSlots>
      {/* Banner oben */}
      <img
        className="headerImage"
        src="/slot-neonfruits-banner.png"
        alt="Slot Banner"
      />

      {/* Slots */}
      <div className="slots">
        {SLOT_ITEMS.map((item, index) => (
          <Slot
            key={index}
            revealed={false}
            good={false}
            index={index}
            item={item}
          />
        ))}
      </div>
    </StyledSlots>
  )
}
