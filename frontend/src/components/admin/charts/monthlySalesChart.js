import React, { useState, useEffect } from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axios from "axios";

export default function MonthlySalesChart() {
    const [sales, setMonthlySales] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const token = localStorage.getItem('token')
    const monthlySales = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            }

            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/admin/monthlySales`, config)
            setMonthlySales(data.salesPerMonth)
            setLoading(false)

        } catch (error) {
           setError(error.response.data.message)
        }
    }
    useEffect(() => {
        monthlySales()

    }, [])

    return (
        <ResponsiveContainer width="90%" height={600}>
            <LineChart width={600} height={300} data={sales} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <Line type="monotone" dataKey="total" stroke="#8884d8" />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
            </LineChart>
        </ResponsiveContainer>
    );
}
