import React, { useState, useEffect } from 'react'
import { fetchFacebookPixel, createFacebookPixel } from '../../Features/Settings/SettingsActions'
import { useDispatch, useSelector } from 'react-redux'
import { Edit, Trash2, Save, X, Loader2 } from 'lucide-react'
import FacebookPixel from './Components/FacebookPixel'

function Settings() {



    return (
        <div dir='ltr' className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-6">
            <div className="max-w-2xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500 bg-clip-text text-transparent mb-2">
                        Settings
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">Configure your tracking and analytics preferences</p>
                </div>
                {/* Content */}
                
                    {/* Facebook Pixel */}
                    <FacebookPixel />


            </div>
        </div>
    )
}

export default Settings