import React from 'react';

export enum AlertBannerType {
    Success = 1,
    Error = 2
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
        case AlertBannerType.Error:
            return "alert-danger";
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
