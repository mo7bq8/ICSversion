import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

const PagePlaceholder = ({ title, icon: Icon, description }) => {
  const DisplayIcon = Icon || Sparkles;

  return (
    <>
      <Helmet>
        <title>{title} | KIPIC EA Platform</title>
        <meta name="description" content={`Manage ${description} within the KIPIC enterprise architecture platform.`} />
      </Helmet>
      <motion.div 
        className="flex items-center justify-center h-full text-center p-8"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="glass-effect w-full max-w-lg">
            <CardContent className="p-10">
                <motion.div
                className="p-4 bg-primary/20 rounded-full mb-6 inline-block"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                <DisplayIcon className="h-16 w-16 text-primary" />
                </motion.div>
                <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
                <p className="text-lg text-muted-foreground">{description}</p>
                <p className="mt-4 text-sm text-gray-500">This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀</p>
            </CardContent>
        </Card>
      </motion.div>
    </>
  );
};

export default PagePlaceholder;