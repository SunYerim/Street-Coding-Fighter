import React, { useState } from "react";
import "../../css/MessageContainer.css";
import { motion } from "framer-motion";
import { Container } from "@mui/system";

const MessageContainer = ({ messageList, user }) => {
  return (
    <div>
      {messageList.map((message, index) => {
        return (
          <Container key={message._id} className="message-container">
            {message.user.name === "system" ? (
              <div className="system-message-container">
                <p className="system-message">{message.chat}</p>
              </div>
            ) : message.user.name === user.name ? (
              <div className="my-message-container">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  transition: { delay: 0.1 },
                  }}
                >
                <div className="my-message">{message.chat}</div>
                </motion.div>
              </div>
            ) : (
              <div className="your-message-container">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  transition: { delay: 0.1 },
                  }}
                >
                <div className="your-username">{message.user.name}</div>
                <div className="your-message">{message.chat}</div>
                </motion.div>
              </div>
            )}
          </Container>
        );
      })}
    </div>
  );
};

export default MessageContainer;
