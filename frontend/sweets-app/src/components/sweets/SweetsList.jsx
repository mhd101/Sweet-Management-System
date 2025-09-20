import SweetCard from "./SweetCard";
import { useSweets } from "../../context/SweetsContext";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export default function SweetsList() {
    const { sweets, searchSweets, purchaseSweet } = useSweets() // sweets context
    // searchSweets param states
    const [name, setName] = useState("")
    const [category, setCategory] = useState("")
    const [range, setRange] = useState([0, 500])

    // handle range change
    const handleChange = (newRange) => {
        setRange(newRange)
    }

    const [minPrice, maxPrice] = range

    useEffect(() => {
        const t = setTimeout(() => {
            searchSweets({ name, category, minPrice, maxPrice });
        }, 300);
        return () => clearTimeout(t);

    }, [name, category, minPrice, maxPrice]);

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    {/* name filter */}
                    <div className="flex items-center gap-2 bg-white p-2 rounded shadow">
                        <Search className="w-5 h-5 text-slate-400" />
                        <input
                            placeholder="Search sweets by name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full outline-none"
                        />
                    </div>

                    {/* category filter */}
                    <div>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="bg-white p-2 rounded shadow w-full"
                        >
                            <option value="">All categories</option>
                            <option value="cake">Cakes</option>
                            <option value="candy">Candy</option>
                            <option value="cookie">Cookie</option>
                            <option value="pie">Pie</option>
                            <option value="other">Others</option>
                        </select>
                    </div>

                    {/* price range filter */}
                    <div className="bg-white p-2 rounded shadow">
                        <h3 className="text-sm font-medium mb-2">Price Range</h3>
                        <Slider
                            range
                            min={0}
                            max={500}
                            step={5}
                            value={range}
                            onChange={handleChange}
                            trackStyle={[{ backgroundColor: "#333" }]}
                            handleStyle={[
                                { borderColor: "#333", backgroundColor: "#fff" },
                                { borderColor: "#333", backgroundColor: "#fff" }
                            ]}
                        />
                        <p className="text-sm mt-2">
                            Selected Range: <b>{minPrice}</b> – <b>{maxPrice}</b>
                        </p>
                    </div>
                </div>
            </div>

            {/* list sweets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
                {sweets?.sweets?.length > 0 ? (sweets?.sweets?.map((s) => (
                    <SweetCard key={s._id} sweet={s} onPurchase={async (id, qty) => {
                        try {
                            await purchaseSweet(id, qty);
                            toast.success(`Purchased ${qty} ${s.name}`)
                        } catch (err) {
                            toast.error("Purchased failed")
                        }
                    }} />
                ))) : (
                    <p className="text-center text-gray-500 col-span-full">
                        No sweets available.
                    </p>
                )}
            </div>
        </div>
    );
}