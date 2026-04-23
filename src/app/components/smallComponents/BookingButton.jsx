'use client';

import React, { useState } from 'react'
import BookingModal from '../model/BookingModal';

const BookingButton = ({ title = "", className = "", bookingType }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (!title) {
        return null;
    }

    return (
        <>
            <button type="button" className={className} onClick={() => setIsSidebarOpen(true)}>{title}</button>
            {
                isSidebarOpen && (
                  <BookingModal
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    bookingType={bookingType}
                  />
                )
              }

        </>
    )
}

export default BookingButton
