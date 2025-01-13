import Image from "next/image";

const Header = () => {
  return (
    <div className="py-6 border-b-2 flex items-center justify-between sticky">
      <Image
        src="/logo.png"
        alt="site logo"
        height={250}
        width={250}
        style={{ objectFit: "cover" }}
      />

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
        
          <Image
            src="/man.png"
            alt="site logo"
            height={40}
            width={40}
            style={{ objectFit: "cover" }}
          />
            <h6 className="font-semibold text-lg font-mono text-slate-400">Account</h6>
        </div>
        <div>
        <button className="bg-primary font-mono text-xl text-white px-4 py-2 rounded-full hover:border-solid border-2 hover:border-primary hover:bg-white hover:text-slate-400" >
          Login
        </button>
        </div>
      
      </div>
    </div>
  );
};

export default Header;
