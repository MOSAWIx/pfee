import React, { useState, useEffect } from 'react'
import { fetchFacebookPixel, createFacebookPixel } from '../../../Features/Settings/SettingsActions'
import { useDispatch, useSelector } from 'react-redux'
import { Edit, Trash2, Save, X, Loader2 } from 'lucide-react'

import { FacebookSelector } from '../../../Selectors/SettingsSelector'

function FacebookPixel() {
    const [pixelId, setPixelId] = useState('')
    const [isEnabled, setIsEnabled] = useState(false)
    const [isSaved, setIsSaved] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [originalPixelId, setOriginalPixelId] = useState('')
    const [originalEnabled, setOriginalEnabled] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    // Selectror
    const facebookPixel = useSelector(FacebookSelector.facebookPixelId)
    const isActive = useSelector(FacebookSelector.facebookActive)


    const dispatch = useDispatch()

    useEffect(() => {
        const fetchPixel = async () => {

            try {
                const response = await dispatch(fetchFacebookPixel())
                console.log('Fetched Facebook Pixel response:', response)
                if (response.payload) {
                    const fetchedPixelId = response.payload.data.facebookPixelId || ''
                    const fetchedEnabled = response.payload.data.active || false
                    console.log('Fetched Facebook Pixel ID:', fetchedPixelId)
                    setPixelId(fetchedPixelId)
                    setOriginalPixelId(fetchedPixelId)
                    setIsEnabled(fetchedEnabled)
                    setOriginalEnabled(fetchedEnabled)
                }
            } catch (error) {
                console.error('Failed to fetch Facebook Pixel:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchPixel()
    }, [dispatch])

    const handleSave = async () => {
        setIsLoading(true)
        try {
            console.log('Saving Facebook Pixel ID:', pixelId, 'Enabled:', isEnabled)
            if (isEnabled && pixelId.trim()) {
                // Save with pixel ID and enabled status
                await dispatch(createFacebookPixel({ facebookPixelId: pixelId.trim(), isEnabled }))
                setOriginalPixelId(pixelId.trim())
                setOriginalEnabled(true)
            } else if (!isEnabled) {
                // Disable pixel
                await dispatch(createFacebookPixel({ facebookPixelId: originalPixelId || pixelId, isEnabled: false }))
                setOriginalEnabled(false)
            }
            setIsEditing(false)
            setIsSaved(true)
            // Reset saved state after 3 seconds
            setTimeout(() => setIsSaved(false), 3000)
        } catch (error) {
            console.error('Failed to save Facebook Pixel:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleEdit = () => {
        setIsEditing(true)
        setIsSaved(false)
    }

    const handleCancelEdit = () => {
        setPixelId(originalPixelId)
        setIsEnabled(originalEnabled)
        setIsEditing(false)
        setIsSaved(false)
    }

    const handleDelete = async () => {
        
        
        setIsLoading(true)
        try {
            console.log('Deleting Facebook Pixel')
            // Send null to delete the pixel completely
            await dispatch(createFacebookPixel({ facebookPixelId: null, isEnabled: false }))
            setPixelId('')
            setOriginalPixelId('')
            setIsEnabled(false)
            setOriginalEnabled(false)
            setIsEditing(false)
            setIsSaved(false)
        } catch (error) {
            console.error('Failed to delete Facebook Pixel:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleReset = () => {
        dispatch(createFacebookPixel({ facebookPixelId: '', isEnabled: false }))
        setPixelId('')
        setOriginalPixelId('')
        setIsEnabled(false)
        setOriginalEnabled(false)
        setIsSaved(false)
        setIsEditing(false)
        
    }

    const handleToggleEnabled = (e) => {
        const newEnabled = e.target.checked
        dispatch(createFacebookPixel({ facebookPixelId: pixelId.trim(), isEnabled: newEnabled }))
        setIsEnabled(newEnabled)
        setIsSaved(false)

        // If we're disabling and there's no existing pixel, clear the input
        if (!newEnabled && !hasExistingPixel) {
            setPixelId('')
        }
    }

    const handlePixelIdChange = (e) => {
        setPixelId(e.target.value)
        setIsSaved(false)
    }

    
    const hasExistingPixel = originalPixelId.trim() !== ''
    const hasChanges = pixelId !== originalPixelId || isEnabled !== originalEnabled
    const canSave = (isEnabled && pixelId.trim()) || (!isEnabled && hasExistingPixel)
    return (
        <>
                        {/* Main Settings Card */}
                                {/* Main Settings Card */}
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg dark:shadow-2xl">
                    <div className="space-y-6">
                        {/* Facebook Pixel Section */}
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">Facebook Pixel</h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">Track conversions and optimize ad campaigns</p>
                                </div>
                                <div className="flex items-center">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={isEnabled}
                                            onChange={handleToggleEnabled}
                                            disabled={isLoading}
                                            className="sr-only peer"
                                        />
                                        <div className={`w-11 h-6 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}></div>
                                    </label>
                                </div>
                            </div>

                            {/* Pixel ID Input */}
                            <div className="space-y-2">
                                <label htmlFor="pixelId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Pixel ID
                                </label>
                                <div className="relative">
                                    <input
                                        id="pixelId"
                                        type="text"
                                        value={pixelId}
                                        onChange={handlePixelIdChange}
                                        placeholder="Enter your Facebook Pixel ID (e.g., 1234567890123456)"
                                        disabled={!isEnabled || isLoading}
                                        className={`w-full px-4 py-3 bg-white dark:bg-gray-700 border rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 ${
                                            !isEnabled || isLoading
                                                ? 'border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-50'
                                                : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20'
                                        } pr-20`}
                                    />
                                    
                                    {/* Status indicator or action icons */}
                                    <div className="absolute right-3 top-3 flex items-center gap-2">
                                        {/* Loading spinner when saving */}
                                        {isLoading && (
                                            <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
                                        )}
                                        
                                        {/* Active indicator */}
                                        {pixelId && isEnabled && !isLoading && (
                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Pixel Active"></div>
                                        )}
                                        
                                        {/* Edit icon for existing pixel */}
                                        {hasExistingPixel && !isLoading && (
                                            <button
                                                onClick={handleEdit}
                                                className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                                                title="Edit Pixel ID"
                                            >
                                                <Edit size={16} />
                                            </button>
                                        )}
                                        
                                        {/* Delete icon for existing pixel */}
                                        {hasExistingPixel && !isLoading && (
                                            <button
                                                onClick={handleDelete}
                                                className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                                                title="Delete Pixel ID"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                        
                                        {/* Save icon when there are changes */}
                                        {hasChanges && canSave && !isLoading && (
                                            <button
                                                onClick={handleSave}
                                                className="p-1 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 transition-colors"
                                                title="Save changes"
                                            >
                                                <Save size={16} />
                                            </button>
                                        )}
                                        
                                        {/* Cancel icon when editing */}
                                        {(isEditing || hasChanges) && !isLoading && (
                                            <button
                                                onClick={handleCancelEdit}
                                                className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                                                title="Cancel changes"
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                    Find your Pixel ID in Facebook Events Manager under Data Sources
                                </p>
                            </div>

                            {/* Status Indicator */}
                            <div className="mt-4">
                                {isEnabled && (
                                    <div className="p-3 bg-blue-50 dark:bg-gray-700 rounded-lg border-l-4 border-blue-500">
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
                                            <span className="text-sm text-blue-700 dark:text-blue-300">
                                                {isLoading ? 
                                                    'Saving pixel configuration...' :
                                                    pixelId ? 
                                                        'Pixel configured and active' 
                                                        : 'Pixel enabled, awaiting ID'
                                                }
                                            </span>
                                        </div>
                                    </div>
                                )}
                                
                                {!isEnabled && hasExistingPixel && (
                                    <div className="p-3 bg-yellow-50 dark:bg-gray-700 rounded-lg border-l-4 border-yellow-500">
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                                            <span className="text-sm text-yellow-700 dark:text-yellow-300">
                                                Pixel disabled but configuration saved
                                            </span>
                                        </div>
                                    </div>
                                )}
                                
                                {!isEnabled && !hasExistingPixel && (
                                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border-l-4 border-gray-500">
                                        <div className="flex items-center">
                                            <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                                Pixel tracking disabled
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-2">
                            {hasChanges && (
                                <button
                                    onClick={handleSave}
                                    disabled={!canSave || isLoading}
                                    className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                                        canSave && !isLoading
                                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-blue-500/25 transform hover:scale-[1.02]'
                                            : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                            Saving...
                                        </span>
                                    ) : isSaved ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Saved
                                        </span>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </button>
                            )}
                            
                            <button
                                onClick={handleReset}
                                disabled={isLoading}
                                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-lg font-medium transition-all duration-200 border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Reset All
                            </button>
                        </div>
                    </div>
                </div>
        </>
    )
}

export default FacebookPixel