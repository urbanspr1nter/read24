import React from 'react';

export enum AlertBannerType {
    Success = 0
};

interface AlertBannerProps {
    type: AlertBannerType;
    message: string;
    visible: boolean;
};

function getAlertBannerClassName(type: AlertBannerType) {
    switch(type) {
        case AlertBannerType.Success:
            return "alert-success";
        default:
            return "alert-primary";
    }
}

export default function AlertBanner(props: AlertBannerProps) {
    const {
        type,
        message,
        visible
    } = props;

    if (!visible)
        return null;

    let className = `alert ${getAlertBannerClassName(type)}`;

    return (
        <div className={className} role="alert">
            {message}
        </div>
    );
}
