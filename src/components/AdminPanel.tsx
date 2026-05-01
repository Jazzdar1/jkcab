diff --git a/src/components/AdminPanel.tsx b/src/components/AdminPanel.tsx
index 68c8f560e526727313d5fa836c335cffbc6c0577..1af08069c92681b92c73721053bfb125a7196202 100644
--- a/src/components/AdminPanel.tsx
+++ b/src/components/AdminPanel.tsx
@@ -82,51 +82,51 @@ export default function AdminPanel() {
       authInfo: {
         userId: user?.uid,
         email: user?.email,
       },
       operationType,
       path
     };
     console.error('Firestore Error: ', JSON.stringify(errInfo));
     toast.error(`Permission Denied: ${operationType} on ${path}`);
   };
 
   useEffect(() => {
     // Session check for manual bypass
     const sessionAuth = sessionStorage.getItem('admin_unlocked');
     if (sessionAuth === 'true') {
       setIsUnlocked(true);
       setIsAdmin(true);
     }
     setLoading(false);
   }, []);
 
   const handleUnlock = async (e: React.FormEvent) => {
     e.preventDefault();
     const masterPass = import.meta.env.VITE_ADMIN_PASSWORD || 'jkcabs2010';
     if (pinInput === masterPass) {
-      await login(); // Sync with global AuthContext
+      await loginAnonymously(); // Sync with global AuthContext
       setIsUnlocked(true);
       setIsAdmin(true);
       sessionStorage.setItem('admin_unlocked', 'true');
       toast.success("Secure Portal Unlocked");
     } else {
       toast.error("Invalid Access Key");
     }
   };
 
   useEffect(() => {
     if (!isUnlocked) return;
 
     const unsubFleet = onSnapshot(collection(db, 'fleet'), (snap) => {
       setFleet(snap.docs.map(d => ({ id: d.id, ...d.data() })));
     }, (err) => handleFirestoreError(err, 'list', 'fleet'));
 
     const unsubRates = onSnapshot(collection(db, 'rates'), (snap) => {
       setRates(snap.docs.map(d => ({ id: d.id, ...d.data() })));
     }, (err) => handleFirestoreError(err, 'list', 'rates'));
 
     const unsubDrivers = onSnapshot(collection(db, 'drivers'), (snap) => {
       setDrivers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
     }, (err) => handleFirestoreError(err, 'list', 'drivers'));
 
     const unsubPackages = onSnapshot(collection(db, 'packages'), (snap) => {
