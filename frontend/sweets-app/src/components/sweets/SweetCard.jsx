import { ShoppingCart } from "lucide-react"
import { useState } from "react"


export default function SweetCard({ sweet, onPurchase }) {
    const [qty, setQty] = useState(1)

    const increment = () => {
        if (qty < sweet.quantity) {
            setQty(qty + 1)
        }
    }

    const decrement = () => {
        if (qty > 1) {
            setQty(qty - 1)
        }
    }

    return (
        <div className="bg-white rounded-lg shadow p-4 flex flex-col">

            <div className="flex-1">
                <h3 className="font-semibold text-lg">{sweet.name}</h3>
                <p className="text-sm text-slate-600">{sweet.category}</p>
                <p className="mt-2 text-indigo-600 font-medium">₹{sweet.price?.toFixed?.(2) ?? sweet.price}</p>
                <p className="text-sm text-gray-500 mt-1">Qty: {sweet.quantity}</p>
            </div>

            <div className="flex items-center gap-2">
                {/* decrement counter */}
                <button
                    onClick={decrement}
                    disabled={qty <= 1}
                    className={`px-2 py-1 rounded ${qty <= 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gray-300 hover:bg-gray-400"
                        }`}
                >
                    –
                </button>

                {/* quantity display */}
                <span className="w-8 text-center font-medium">{qty}</span>

                {/* increment counter */}
                <button
                    onClick={increment}
                    disabled={qty >= sweet.quantity}
                    className={`px-2 py-1 rounded ${qty >= sweet.quantity ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gray-300 hover:bg-gray-400"
                        }`}
                >
                    +
                </button>

                {/* purchase button */}
                <button
                    onClick={() => onPurchase(sweet._id, qty)}
                    disabled={!sweet.quantity}
                    className={`flex items-center gap-2 px-3 py-2 rounded ${sweet.quantity
                            ? "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                >
                    <ShoppingCart className="w-4 h-4" />
                    Purchase
                </button>
            </div>
        </div>
    )
}