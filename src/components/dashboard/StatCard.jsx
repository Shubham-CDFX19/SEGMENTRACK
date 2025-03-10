
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, iconBg, change, changeText, changeType }) => {
  return (
    <motion.div 
      className="stat-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {change && (
            <p className={`text-xs mt-1 ${changeType === 'positive' ? 'text-gym-green' : 'text-gym-red'}`}>
              {changeType === 'positive' ? '+' : ''}{change} {changeText}
            </p>
          )}
        </div>
        <div className={`stat-card-icon ${iconBg}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
