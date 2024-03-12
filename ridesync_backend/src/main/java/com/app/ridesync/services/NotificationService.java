package com.app.ridesync.services;

import com.app.ridesync.entities.Notification;
import com.app.ridesync.repositories.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    public boolean addNotification(Notification notification){
        notification.setReadFlag(0);
        notification.setTimeStamp(LocalDateTime.now());
        notificationRepository.save(notification);
        return false;
    }

    public List<Notification> getNotification(Integer userId){
        List<Notification> result = notificationRepository.findByUserId(userId);
        for(Notification n:result){
            n.setReadFlag(1);
            notificationRepository.save(n);
        }
        return result;
    }

}
