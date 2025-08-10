import React from 'react';
import DataTable from './DataTable';
import { Link, Shield } from 'lucide-react';

const SecurityTab = ({ networkDependencies, networkSecurity, canEdit }) => {
  return (
    <div className="mt-4 space-y-6">
      <DataTable 
        title="Dependencies" 
        data={networkDependencies} 
        icon={Link} 
        canEdit={false} // Dependencies are usually derived, not directly edited
        columns={[
          { header: 'Application', key: 'application' }, 
          { header: 'Depends On', key: 'depends_on' }, 
          { header: 'Interface', key: 'interface' }
        ]}
      />
      <DataTable 
        title="Security & Compliance" 
        data={networkSecurity} 
        icon={Shield} 
        canEdit={canEdit} // Security can be edited
        columns={[
          { header: 'Interface/Zone', key: 'interface' }, 
          { header: 'Security Controls', key: 'security' }, 
          { header: 'Compliance', key: 'compliance' }
        ]}
      />
    </div>
  );
};

export default SecurityTab;